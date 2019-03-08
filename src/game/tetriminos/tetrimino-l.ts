import { external, inject } from "tsdi";
import { matrixInitializer, Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "../playfield";

export class TetriminoMatrixL extends Matrix {
    constructor() {
        super(vec2(3, 3), matrixInitializer(CellColor.TETRIMINO_L, [
            0, 0, 1,
            1, 1, 1,
            0, 0, 0,
        ]));
    }
}

@external
export class TetriminoL extends Tetrimino {
    constructor(playfield: Playfield, @inject config?: Config) {
        super(
            new TetriminoMatrixL(),
            config!.visibleSize.horizontalCenter().add(vec2(0, -2)),
            playfield,
        );
    }
}
