import { external, inject } from "tsdi";
import { Matrix } from "../matrix";
import { vec2, Vec2 } from "../vec2";
import { matrixInitializer } from "./matrix-initializer";
import { CellColor } from "../cell-color";
import { Tetrimino } from "../tetrimino";
import { Config } from "../config";

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
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixL(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -3)),
        );
    }
}
