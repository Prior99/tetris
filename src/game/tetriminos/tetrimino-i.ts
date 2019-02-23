import { external, inject } from "tsdi";
import { Matrix } from "../matrix";
import { vec2 } from "utils";
import { matrixInitializer } from "./matrix-initializer";
import { CellColor } from "../cell-color";
import { Rotation, Tetrimino } from "./tetrimino";
import { Config } from "config";

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

    public rotateLeft() {
        const newMatrix = this.matrix.rotateLeft();
        switch (this.rotation) {
            case Rotation.DEG_0:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, -1)))
                ) {
                    this.setRotation(Rotation.DEG_270);
                }
                return;
            case Rotation.DEG_90:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -2)))
                ) {
                    this.setRotation(Rotation.DEG_0);
                }
                return;
            case Rotation.DEG_180:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, 1)))
                ) {
                    this.setRotation(Rotation.DEG_90);
                }
                return;
            case Rotation.DEG_270:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 2)))
                ) {
                    this.setRotation(Rotation.DEG_180);
                }
                return;
        }
    }

    public rotateRight() {
        const newMatrix = this.matrix.rotateRight();
        switch (this.rotation) {
            case Rotation.DEG_0:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 2)))
                ) {
                    this.setRotation(Rotation.DEG_90);
                }
                return;
            case Rotation.DEG_90:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 1)))
                ) {
                    this.setRotation(Rotation.DEG_180);
                }
                return;
            case Rotation.DEG_180:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -2)))
                ) {
                    this.setRotation(Rotation.DEG_270);
                }
                return;
            case Rotation.DEG_270:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-2, -1)))
                ) {
                    this.setRotation(Rotation.DEG_0);
                }
                return;
        }
    }
}
