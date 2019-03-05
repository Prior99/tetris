import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "../playfield";

export class TetriminoMatrixS extends Matrix {
    constructor() {
        super(vec2(3, 3), matrixInitializer(CellColor.TETRIMINO_S, [
            0, 1, 1,
            1, 1, 0,
            0, 0, 0,
        ]));
    }
}

@external
export class TetriminoS extends Tetrimino {
    constructor(playfield: Playfield, @inject config?: Config) {
        super(
            new TetriminoMatrixS(),
            config!.visibleSize.horizontalCenter().add(vec2(0, -2)),
            playfield,
        );
    }
}
