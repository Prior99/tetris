import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";

export class TetriminoMatrixT extends Matrix {
    constructor() {
        super(vec2(3, 2), matrixInitializer(CellColor.TETRIMINO_T, [
            1, 1, 1,
            0, 1, 0,
        ]));
    }
}

@external
export class TetriminoT extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixT(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -2)),
        );
    }
}
