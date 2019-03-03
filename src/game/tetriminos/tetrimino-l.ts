import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "../playfield";

export class TetriminoMatrixL extends Matrix {
    constructor() {
        super(vec2(2, 3), matrixInitializer(CellColor.TETRIMINO_L, [
            1, 0,
            1, 0,
            1, 1,
        ]));
    }
}

@external
export class TetriminoL extends Tetrimino {
    constructor(playfield: Playfield, @inject config?: Config) {
        super(
            new TetriminoMatrixL(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -3)),
            playfield,
        );
    }
}
