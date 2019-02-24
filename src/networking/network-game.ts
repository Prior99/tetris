import { component, inject } from "tsdi";
import { RemoteUsers } from "./remote-users";
import { GameState, ShuffleBag, Playfield, Matrix } from "game";
import { Config } from "config";

@component
export class NetworkGame {
    @inject private users: RemoteUsers;
    @inject private config: Config;

    public seed: string;

    private playfields = new Map<string, Matrix>();

    public start(seed: string) {
        this.seed = seed;
        this.users.all.forEach(user => {
            this.playfields.set(user.id, new Matrix(this.config.logicalSize));
        });
    }

    public get all() {
        return Array.from(this.playfields.values());
    }

    public update(userId: string, matrix: Matrix) {
        this.playfields.get(userId)!.update(matrix);
    }

    public byUser(userId: string) {
        return this.playfields.get(userId);
    }
}
