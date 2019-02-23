import { external, inject } from "tsdi";
import { Matrix } from "../matrix";
import { vec2 } from "utils";
import { matrixInitializer } from "./matrix-initializer";
import { CellColor } from "../cell-color";
import { Tetrimino } from "./tetrimino";
import { Config } from "config";

export class TetriminoMatrixS extends Matrix {
    constructor() {
        super(vec2(3, 2), matrixInitializer(CellColor.TETRIMINO_S, [
            0, 1, 1,
            1, 1, 0,
        ]));
    }
}

@external
export class TetriminoS extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixS(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -2)),
        );
    }
}
