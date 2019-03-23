import { external, inject } from "tsdi";
import { matrixInitializer, Matrix, vec2 } from "utils";
import { CellColor } from "types";
import { Config } from "config";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "../playfield";

export class TetriminoMatrixZ extends Matrix {
    constructor() {
        super(vec2(3, 3), matrixInitializer(CellColor.TETRIMINO_Z, [
            1, 1, 0,
            0, 1, 1,
            0, 0, 0,
        ]));
    }
}

@external
export class TetriminoZ extends Tetrimino {
    constructor(playfield: Playfield, @inject config?: Config) {
        super(
            new TetriminoMatrixZ(),
            config!.visibleSize.horizontalCenter().add(vec2(0, -1)),
            playfield,
        );
    }
}
