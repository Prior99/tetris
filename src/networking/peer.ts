import { inject } from "tsdi";
import { observable } from "mobx";
import PeerJS from "peerjs";
import { History } from "history";
import { Matrix } from "utils";
import { UI } from "ui";
import { Config } from "config";
import { Game } from "game";
import { GameOverReason, GameParameters } from "types";
import { ObservableGame } from "observable-game";
import { Message, MessageType } from "./messages";
import { RemoteUsers } from "./remote-users";
import { NetworkGame } from "./network-game";
import { Chat } from "./chat";

export abstract class Peer {
    @inject protected config: Config;
    @inject private ui: UI;
    @inject protected game: Game;
    @inject protected observableGame: ObservableGame;
    @inject("History") private history: History;

    protected peer?: PeerJS;
    private timeout?: any;

    constructor(
        protected users: RemoteUsers,
        protected chat: Chat,
        protected networkGame: NetworkGame,
        protected name: string,
    ) {}

    protected abstract send(message: Message): void;

    @observable public id?: string;

    public sendChatMessage(text: string) {
        if (!this.id) { throw new Error("Attempted to send chat message when connection not fully open."); }
        const chatMessage = { text, userId: this.id, date: new Date() };
        this.chat.add(chatMessage);
        this.send({
            message: MessageType.CHAT_MESSAGE,
            chatMessage,
        });
    }

    public sendPause() {
        this.send({ message: MessageType.PAUSE });
        this.pauseNetworkGame();
    }

    public sendUnpause() {
        this.send({ message: MessageType.UNPAUSE });
        this.unpauseNetworkGame();
    }

    public async close(): Promise<void> {
        this.stopNetworkGame();
        this.id = undefined;
        if (!this.peer) { return; }
        this.peer.destroy();
    }

    protected async open(): Promise<void> {
        await new Promise(resolve => {
            this.peer = new PeerJS(null as any, { host: "peerjs.92k.de", secure: true });
            this.peer.on("open", () => resolve());
        });
        if (!this.peer) { throw new Error("Connection id could not be determined."); }
        this.id = this.peer.id;
        this.users.setOwnUser({ id: this.id, name: this.ui.name });
    }

    protected sendTo(connection: PeerJS.DataConnection, message: Message) {
        connection.send(message);
    }

    protected handleMessage(connectionId: string, message: Message) {
        switch (message.message) {
            case MessageType.CHAT_MESSAGE: {
                this.chat.add(message.chatMessage);
                break;
            }
            case MessageType.PARAMETERS_CHANGE: {
                this.networkGame.parameters = message.parameters;
                break;
            }
            case MessageType.WELCOME: {
                this.users.add(...message.users);
                this.networkGame.parameters = message.parameters;
                break;
            }
            case MessageType.USER_CONNECTED: {
                this.users.add(message.user);
                break;
            }
            case MessageType.START: {
                this.startNetworkGame(message.parameters);
                break;
            }
            case MessageType.UPDATE_PLAYFIELD: {
                this.networkGame.update(
                    message.userId,
                    new Matrix(this.config.logicalSize, message.matrix),
                    message.state,
                );
                this.checkGameOver();
                break;
            }
            case MessageType.RESTART: {
                this.restartNetworkGame(message.parameters);
                break;
            }
            case MessageType.GARBAGE: {
                if (this.id === message.targetId) {
                    this.game.addIncomingGarbage(message.garbage);
                }
                break;
            }
            case MessageType.PAUSE: {
                this.pauseNetworkGame();
                break;
            }
            case MessageType.UNPAUSE: {
                this.unpauseNetworkGame();
                break;
            }
        }
    }

    private checkGameOver() {
        if (this.networkGame.isGameOverLastManStanding) { this.game.gameOverLastManStanding(); }
        if (this.networkGame.isGameOverOtherUserClearedGarbage) { this.game.gameOverOtherUserHasWon(); }
    }

    protected restartNetworkGame(parameters: GameParameters) {
        this.networkGame.restart(parameters);
        this.ui.reset();
        this.observableGame.restart(parameters);
    }

    protected startNetworkGame(parameters: GameParameters) {
        this.networkGame.start();
        this.observableGame.start(parameters);
        this.tick();
        this.history.push("/multi-player");
    }

    protected stopNetworkGame() {
        this.observableGame.stop();
        if (!this.timeout) { return; }
        clearTimeout(this.timeout);
    }

    protected pauseNetworkGame() {
        this.observableGame.pause();
    }

    protected unpauseNetworkGame() {
        this.observableGame.unpause();
    }

    protected tick() {
        if (!this.id) { throw new Error("Tried to tick with connection id unknown."); }
        const state = {
            score: this.game.score,
            lines: this.game.lines,
            level: this.game.level,
            gameOverReason: this.game.gameOverReason,
            timeGameOver: this.game.timeGameOver,
        };
        // Only send updates if not game over or game over not yet sent.
        if (this.networkGame.ownState.gameOverReason === GameOverReason.NONE) {
            this.networkGame.update(this.id, this.game.temporaryState, state);
            this.send({
                message: MessageType.UPDATE_PLAYFIELD,
                userId: this.id,
                matrix: this.game.temporaryState.toBase64(),
                state,
            });
            if (this.game.hasOutgoingGarbage) {
                this.game.outgoingGarbage.forEach(garbage => {
                    const targetId = this.networkGame.randomOtherAliveUser;
                    if (!targetId) { return; }
                    this.send({ message: MessageType.GARBAGE, targetId, garbage });
                });
                this.game.clearOutgoingGarbage();
            }
        }
        this.timeout = setTimeout(() => this.tick(), this.config.networkSpeed * 1000);
    }
}
