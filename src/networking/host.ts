import { external } from "tsdi";
import PeerJS from "peerjs";
import { randomSeed } from "utils";
import { GameParameters } from "types";
import { Message, MessageType } from "./messages";
import { Peer } from "./peer";
import { RemoteUsers } from "./remote-users";
import { NetworkGame } from "./network-game";
import { Chat } from "./chat";

@external
export class Host extends Peer {
    private connections = new Map<string, PeerJS.DataConnection>();

    constructor(
        users: RemoteUsers,
        chat: Chat,
        networkGame: NetworkGame,
        name: string,
    ) { super(users, chat, networkGame, name); }

    private forwardMessage(originId: string, message: Message) {
        if ([MessageType.HELLO, MessageType.WELCOME].includes(message.message)) {
            return;
        }
        Array.from(this.connections.entries())
            .filter(([id, connection]) => id !== originId)
            .forEach(([id, connection]) => this.sendTo(connection, message));
    }

    protected handleMessage(originId: string, message: Message) {
        this.forwardMessage(originId, message);
        super.handleMessage(originId, message);
    }

    protected send(message: Message) {
        this.connections.forEach(connection => this.sendTo(connection, message));
    }

    public async host() {
        await this.open();
        if (!this.peer || !this.id) { throw new Error("PeerJS failed to initialize."); }
        this.peer.on("connection", connection => this.handleConnect(connection));
    }

    public sendStartGame() {
        this.send({ message: MessageType.START, parameters: this.networkGame.parameters });
        this.startNetworkGame(this.networkGame.parameters);
    }

    public sendRestartGame() {
        const parameters = { ...this.networkGame.parameters, seed: randomSeed() };
        this.send({ message: MessageType.RESTART, parameters });
        this.restartNetworkGame(parameters);
    }

    public sendParameterChange(parameters: GameParameters) {
        this.send({ message: MessageType.PARAMETERS_CHANGE, parameters });
    }

    private handleConnect(connection: PeerJS.DataConnection) {
        let connectionId: string;
        connection.on("data", json => {
            const message: Message = json;
            if (message.message === MessageType.HELLO) {
                connectionId = message.user.id;
                this.users.add(message.user);
                this.sendTo(connection, {
                    message: MessageType.WELCOME,
                    users: this.users.all,
                    parameters: this.networkGame.parameters,
                });
                this.send({
                    message: MessageType.USER_CONNECTED,
                    user: message.user,
                });
                this.connections.set(connectionId, connection);
                return;
            }
            if (connectionId) {
                this.handleMessage(connectionId, message);
                return;
            }
            console.error(`Received message without previous HELLO: ${json}`);
        });
    }
}
