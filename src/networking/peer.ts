import { inject } from "tsdi";
import { observable } from "mobx";
import PeerJS from "peerjs";
import { Matrix } from "utils";
import { UI } from "ui";
import { Config } from "config";
import { Game } from "game";
import { GameOverReason, Page, GameParameters, WinningConditionType } from "types";
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

    public async close(): Promise<void> {
        this.stopNetworkGame();
        this.id = undefined;
        if (!this.peer) { return; }
        this.peer.destroy();
    }

    protected async open(): Promise<void> {
        await new Promise(resolve => {
            this.peer = new PeerJS(null as any, { debug: 3 });
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
                switch (this.game.parameters.winningCondition.condition) {
                    case WinningConditionType.BATTLE_ROYALE: {
                        if (message.state.gameOverReason !== GameOverReason.NONE && !this.game.gameOver) {
                            this.game.gameOverLastManStanding();
                        }
                    }
                    case WinningConditionType.CLEAR_GARBAGE: {
                        if (message.state.gameOverReason === GameOverReason.GARBAGE_CLEARED && !this.game.gameOver) {
                            this.game.gameOverOtherUserHasWon();
                        }
                    }
                }
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
        }
    }

    protected restartNetworkGame(parameters: GameParameters) {
        this.networkGame.parameters = parameters;
        this.ui.reset();
        this.observableGame.restart(parameters);
    }

    protected startNetworkGame(parameters: GameParameters) {
        this.networkGame.initialize();
        this.observableGame.start(parameters);
        this.tick();
        this.ui.page = Page.MULTI_PLAYER;
    }

    protected stopNetworkGame() {
        this.observableGame.stop();
        if (!this.timeout) { return; }
        clearTimeout(this.timeout);
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
        this.networkGame.update(this.id, this.game.temporaryState, state);
        this.send({
            message: MessageType.UPDATE_PLAYFIELD,
            userId: this.id,
            matrix: this.game.temporaryState.toBase64(),
            state,
        });
        if (this.game.hasOutgoingGarbage) {
            this.game.outgoingGarbage.forEach(garbage => {
                const target = this.networkGame.randomOtherAliveUser;
                if (!target) { return; }
                this.send({
                    message: MessageType.GARBAGE,
                    targetId: target.id,
                    garbage,
                });
            });
            this.game.clearOutgoingGarbage();
        }
        this.timeout = setTimeout(() => this.tick(), this.config.networkSpeed * 1000);
    }
}
