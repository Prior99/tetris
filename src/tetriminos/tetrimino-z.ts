import { external, inject } from "tsdi";
import { Matrix } from "../matrix";
import { vec2, Vec2 } from "../vec2";
import { matrixInitializer } from "./matrix-initializer";
import { CellColor } from "../cell-color";
import { Tetrimino } from "../tetrimino";
import { Config } from "../config";

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
