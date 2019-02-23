import { component } from "tsdi";
import { Tetrimino } from "./tetrimino";
import {
    TetriminoI,
    TetriminoJ,
    TetriminoL,
    TetriminoO,
    TetriminoS,
    TetriminoT,
    TetriminoZ,
} from "./tetriminos";
import { Constructable } from "./constructable";

function shuffle<T>(array: T[]): T[] {
    const result: T[] = [];
    while (array.length > 0) {
        const index = Math.floor(Math.random() * array.length);
        const [element] = array.splice(index, 1);
        result.push(element);
    }
    return result;
}

@component
export class ShuffleBag {
    private sequence: Constructable<Tetrimino>[] = [];

    constructor() {
        this.refill();
    }

    public take(): Tetrimino {
        const nextTetrimino = this.sequence.shift()!;
        if (this.sequence.length <= 7) { this.refill(); }
        return new nextTetrimino();
    }

    public get nextFive(): Constructable<Tetrimino>[] {
        return this.sequence.slice(0, 5);
    }

    private refill() {
        this.sequence.push(...shuffle([
            TetriminoI,
            TetriminoJ,
            TetriminoL,
            TetriminoO,
            TetriminoS,
            TetriminoT,
            TetriminoZ,
        ]));
    }
}
