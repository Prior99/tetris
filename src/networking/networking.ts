import { component } from "tsdi";
import { observable, computed } from "mobx";
import { bind } from "lodash-decorators";
import { GameParameters, NetworkingMode, RemoteUser, ChatMessage } from "types";
import { Peer } from "./peer";
import { Host } from "./host";
import { Client } from "./client";
import { RemoteUsers } from "./remote-users";
import { NetworkGame } from "./network-game";
import { Chat } from "./chat";

@component
export class Networking {
    private peer: Peer;
    private users: RemoteUsers;
    private networkGame: NetworkGame;
    private chat: Chat;

    @observable public mode = NetworkingMode.DISCONNECTED;

    private initialize() {
        this.users = new RemoteUsers();
        this.networkGame = new NetworkGame(this.users);
        this.chat = new Chat();
    }

    @bind public async host(name: string) {
        this.initialize();
        this.mode = NetworkingMode.HOST;
        const host = new Host(this.users!, this.chat!, this.networkGame!, name);
        await host.host();
        this.peer = host;
    }

    @bind public async client(hostId: string, name: string) {
        this.initialize();
        this.mode = NetworkingMode.CLIENT;
        const client = new Client(this.users!, this.chat!, this.networkGame!, hostId, name);
        await client.connect();
        this.peer = client;
    }

    @bind public async close() {
        this.mode = NetworkingMode.DISCONNECTED;
        this.peer.close();
    }

    @bind public startGame() {
        if (this.mode !== NetworkingMode.HOST) { return; }
        (this.peer as Host).sendStartGame();
    }

    @bind public restartGame() {
        if (this.mode !== NetworkingMode.HOST) { return; }
        (this.peer as Host).sendRestartGame();
    }

    @bind public sendChatMessage(text: string) {
        this.peer.sendChatMessage(text);
    }

    @bind public userById(id: string): RemoteUser | undefined {
        return this.users.byId(id);
    }

    @computed public get hostId(): string | undefined {
        switch (this.mode) {
            case NetworkingMode.HOST: return (this.peer as Host).id;
            case NetworkingMode.CLIENT: return (this.peer as Client).remoteId;
            default: return;
        }
    }

    @computed public get allUsers(): RemoteUser[] {
        return this.users.all;
    }

    @computed public get chatMessages(): ChatMessage[] {
        return this.chat.messages;
    }

    @computed public get gameOngoing() {
        return this.mode !== NetworkingMode.DISCONNECTED;
    }

    @bind public playfieldForUser(userId: string) {
        return this.networkGame.playfieldForUser(userId);
    }

    @bind public stateForUser(userId: string) {
        return this.networkGame.stateForUser(userId);
    }

    @computed public get isHost() {
        return this.mode === NetworkingMode.HOST;
    }

    @computed public get allUsersGameOver(): boolean {
        return this.networkGame.allGameOver;
    }

    public isUserInitialized(userId: string) {
        return this.networkGame.playfieldForUser(userId) !== undefined &&
            this.networkGame.stateForUser(userId) !== undefined;
    }

    @computed public get ownId() {
        return this.peer.id;
    }

    @computed public get parameters() {
        return this.networkGame.parameters;
    }

    @bind public changeParameters(parameters: GameParameters) {
        if (this.isHost) { return; }
        this.networkGame.parameters = parameters;
        (this.peer as Host).sendParameterChange(parameters);
    }

    @computed public get isWinner(): boolean {
        if (!this.currentWinners) { return false; }
        return this.currentWinners.includes(this.ownId!);
    }

    @computed public get currentWinners(): string[] | undefined {
        return this.networkGame.currentWinners;
    }

    @computed public get scoreboard() {
        return this.networkGame.scoreboard;
    }

    @bind public pause() {
        this.peer.sendPause();
    }

    @bind public unpause() {
        this.peer.sendUnpause();
    }
}
