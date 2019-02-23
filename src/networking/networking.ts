import Peer from "peerjs";
import { observable } from "mobx";
import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Message, MessageType } from "./messages";
import { RemoteUsers } from "./remote-users";
import { generateName } from "names";
import { Chat } from "./chat";

export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

@component
export class Networking {
    @inject private users: RemoteUsers;
    @inject private chat: Chat;

    private peer: Peer;
    private connection: Peer.DataConnection;
    private connections: Peer.DataConnection[] = [];

    @observable public id: string;
    @observable public remoteId: string;
    @observable public name = generateName();
    @observable public mode = NetworkingMode.DISCONNECTED;

    @initialize protected initialize() {
        this.peer = new Peer(null as any, { debug: 3 });
        this.peer.on("open", () => {
            this.id = this.peer.id;
            this.peer.on("connection", this.handleConnect);
        });
    }

   @bind private handleMessage(connectionId: string, message: Message) {
        console.log(connectionId, message); // tslint:disable-line
        switch (message.message) {
            case MessageType.CHAT_MESSAGE: {
                this.chat.add(message.chatMessage);
                break;
            }
            case MessageType.WELCOME: {
                this.users.add(...message.users);
                break;
            }
            case MessageType.USER_CONNECTED: {
                this.users.add(message.user);
                break;
            }
        }
    }

    public broardcast(message: Message) {
        this.connections.forEach(connection => this.sendTo(connection, message));
    }

    public sendTo(connection: Peer.DataConnection, message: Message) {
        connection.send(JSON.stringify(message));
    }

    @bind private handleConnect(connection: Peer.DataConnection) {
        console.log("Client connected."); // tslint:disable-line
        let connectionId: string;
        connection.on("data", json => {
            const message: Message = JSON.parse(json);
            if (message.message === MessageType.HELLO) {
                connectionId = message.user.id;
                this.users.add(message.user);
                this.sendTo(connection, {
                    message: MessageType.WELCOME,
                    users: this.users.all,
                });
                this.broardcast({
                    message: MessageType.USER_CONNECTED,
                    user: message.user,
                });
                this.connections.push(connection);
            } else {
                if (connectionId) {
                    this.handleMessage(connectionId, message);
                } else {
                    console.error(`Received message without previous HELLO: ${json}`);
                }
            }
        });
    }

    public connect(remoteId: string) {
        this.initialize();
        this.remoteId = remoteId;
        this.mode = NetworkingMode.CLIENT;
        this.connection = this.peer.connect(remoteId, { reliable: true });
        this.connection.on("open", () => {
            console.log("Connected to host."); // tslint:disable-line
            const { name, id } = this;
            this.connection.send(JSON.stringify({
                message: MessageType.HELLO,
                user: { id, name },
            }));
            this.connection.on("data", json => {
                this.handleMessage(remoteId, JSON.parse(json));
            });
        });
    }

    public host() {
        this.initialize();
        this.mode = NetworkingMode.HOST;
        this.users.add({
            id: this.id,
            name: this.name,
        });
    }

    public sendChatMessage(text: string) {
        if (this.mode === NetworkingMode.CLIENT) {
            this.connection.send({
                message: MessageType.CHAT_MESSAGE,
                chatMessage: { text, userId: this.id, date: new Date() },
            });
        }
    }
}
