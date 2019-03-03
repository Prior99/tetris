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
import { randomSeed } from "utils";
import { Playfield } from "./playfield";

export class ShuffleBag {
    private sequence: Tetrimino[] = [];
    private random: Random.RandomSeed;

    constructor(private playfield: Playfield, seed = randomSeed()) {
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

    public take(): Tetrimino {
        if (!this.random) { throw new Error("Can't take from unitialized bag."); }
        const nextTetrimino = this.sequence.shift()!;
        if (this.sequence.length <= 7) { this.refill(); }
        nextTetrimino.refreshGhostPosition();
        return nextTetrimino;
    }

    public get preview(): Tetrimino[] {
        if (!this.random) { throw new Error("Can't peek into from unitialized bag."); }
        return this.sequence.slice(0, 6);
    }

    private refill() {
        this.sequence.push(...this.shuffle([
            new TetriminoI(this.playfield),
            new TetriminoJ(this.playfield),
            new TetriminoL(this.playfield),
            new TetriminoO(this.playfield),
            new TetriminoS(this.playfield),
            new TetriminoT(this.playfield),
            new TetriminoZ(this.playfield),
        ]));
    }
}
