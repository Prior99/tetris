import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { CellColor } from "types";
import { Config } from "config";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";

export class TetriminoMatrixZ extends Matrix {
    constructor() {
        super(vec2(3, 2), matrixInitializer(CellColor.TETRIMINO_Z, [
            1, 1, 0,
            0, 1, 1,
        ]));
    }
}

@external
export class TetriminoZ extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixZ(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -2)),
        );
    }
}
