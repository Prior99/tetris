import { component } from "tsdi";
import { action, observable, computed } from "mobx";
import * as Random from "random-seed";
import {
    Tetrimino,
    TetriminoI,
    TetriminoJ,
    TetriminoL,
    TetriminoO,
    TetriminoS,
    TetriminoT,
    TetriminoZ,
} from "./tetriminos";

@component
export class ShuffleBag {
    @observable private sequence: Tetrimino[] = [];
    private random: Random.RandomSeed;

    public seed(seed = `${Math.random}`.replace(/\./, "")) {
        this.random = Random.create(seed);
        this.refill();
    }

    private shuffle<T>(array: T[]): T[] {
        const result: T[] = [];
        while (array.length > 0) {
            const [element] = array.splice(this.random.range(array.length), 1);
            result.push(element);
        }
        return result;
    }

    @action public take(): Tetrimino {
        if (!this.random) { throw new Error("Can't take from unitialized bag."); }
        const nextTetrimino = this.sequence.shift()!;
        if (this.sequence.length <= 7) { this.refill(); }
        nextTetrimino.refreshGhostPosition();
        return nextTetrimino;
    }

    @computed public get nextFive(): Tetrimino[] {
        if (!this.random) { throw new Error("Can't peek into from unitialized bag."); }
        return this.sequence.slice(0, 5);
    }

    private refill() {
        this.sequence.push(...this.shuffle([
            new TetriminoI(),
            new TetriminoJ(),
            new TetriminoL(),
            new TetriminoO(),
            new TetriminoS(),
            new TetriminoT(),
            new TetriminoZ(),
        ]));
    }
}
