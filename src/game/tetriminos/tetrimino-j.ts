import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";

export class TetriminoMatrixJ extends Matrix {
    constructor() {
        super(vec2(2, 3), matrixInitializer(CellColor.TETRIMINO_J, [
            0, 1,
            0, 1,
            1, 1,
        ]));
    }
}

@external
export class TetriminoJ extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixJ(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -3)),
        );
    }
}
