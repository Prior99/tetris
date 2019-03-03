import { external, inject } from "tsdi";
import { equals } from "ramda";
import { observable, computed } from "mobx";
import { RemoteGameState } from "types";
import { Matrix } from "utils";
import { Config } from "config";
import { RemoteUsers } from "./remote-users";

@external
export class NetworkGame {
    @inject private config: Config;

    @observable private states = new Map<string, RemoteGameState>();

    constructor(private users: RemoteUsers) {}

    private playfields = new Map<string, Matrix>();

    public initialize() {
        this.users.all.forEach(user => {
            this.playfields.set(user.id, new Matrix(this.config.logicalSize));
            this.states.set(user.id, {
                score: 0,
                lines: 0,
                level: 0,
                toppedOut: false,
            });
        });
    }

    @computed public get allStates() {
        return Array.from(this.states.values());
    }

    @computed public get all() {
        return Array.from(this.playfields.values());
    }

    public update(userId: string, matrix: Matrix, state: RemoteGameState) {
        if (!this.playfields.has(userId)) {
            this.playfields.set(userId, matrix);
        }
        else if (!matrix.equals(this.playfields.get(userId)!)) {
            this.playfields.get(userId)!.update(matrix);
        }
        if (!equals(this.states.get(userId), state)) {
            this.states.set(userId, state);
        }
    }

    public playfieldForUser(userId: string) {
        return this.playfields.get(userId);
    }

    public stateForUser(userId: string) {
        return this.states.get(userId);
    }

    @computed public get allToppedOut() {
        return this.allStates.every(({ toppedOut }) => toppedOut);
    }

    @computed public get otherAliveUsers() {
        if (!this.users.own) { throw new Error("Users wasn't initialized when retrieving alive users."); }
        return this.users.all
            .filter(user => user.id !== this.users.own!.id)
            .filter(user => !this.stateForUser(user.id)!.toppedOut);
    }

    public get randomOtherAliveUser() {
        const { otherAliveUsers } = this;
        if (otherAliveUsers.length === 0) { return; }
        return otherAliveUsers[Math.floor(Math.random() * otherAliveUsers.length)];
    }
}
