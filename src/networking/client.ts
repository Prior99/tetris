import { external } from "tsdi";
import { observable } from "mobx";
import PeerJS from "peerjs";
import { Message, MessageType } from "./messages";
import { Peer } from "./peer";
import { RemoteUsers } from "./remote-users";
import { NetworkGame } from "./network-game";
import { Chat } from "./chat";

@external
export class Client extends Peer {
    private connection?: PeerJS.DataConnection;

    @observable public remoteId: string;

    constructor(
        users: RemoteUsers,
        chat: Chat,
        networkGame: NetworkGame,
        remoteId: string,
        name: string,
    ) {
        super(users, chat, networkGame, name);
        this.remoteId = remoteId;
    }

    protected send(message: Message) {
        if (!this.connection) { throw new Error("Can't send message: Connection is closed."); }
        this.sendTo(this.connection, message);
    }

    public async connect(): Promise<void> {
        await this.open();
        await new Promise(resolve => {
            this.connection = this.peer!.connect(this.remoteId, { reliable: true });
            this.connection.on("open", () => {
                this.connection!.on("data", json => this.handleMessage(this.remoteId, json));
                this.sendHello();
                resolve();
            });
        }) ;
    }

    private sendHello() {
        if (!this.users.own) { throw new Error("Users was not initialized before sending HELLO to server."); }
        this.send({
            message: MessageType.HELLO,
            user: this.users.own,
        });
    }
}
