import { external, inject } from "tsdi";
import { Matrix } from "../matrix";
import { vec2, Vec2 } from "../vec2";
import { matrixInitializer } from "./matrix-initializer";
import { CellColor } from "../cell-color";
import { Tetrimino } from "../tetrimino";
import { Config } from "../config";

export class TetriminoMatrixI extends Matrix {
    constructor() {
        super(vec2(1, 4), matrixInitializer(CellColor.TETRIMINO_I, [
            1,
            1,
            1,
            1,
        ]));
    }
}

@external
export class TetriminoI extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixI(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -4)),
        );
    }
}
