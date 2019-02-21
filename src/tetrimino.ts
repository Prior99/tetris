import { external, inject } from "tsdi";
import { vec2, Vec2 } from "./vec2";
import { Matrix } from "./matrix";
import { Playfield } from "./playfield";
import { CellColor } from "./cell-color";

export enum Rotation {
    DEG_0 = 0,
    DEG_90 = 1,
    DEG_180 = 2,
    DEG_270 = 3,
}

@external
export class Tetrimino {
    @inject private playfield: Playfield;

    constructor(
        public matrix: Matrix,
        public offset: Vec2,
        public rotation = Rotation.DEG_0,
    ) {
        switch (this.rotation) {
            case Rotation.DEG_0: break;
            case Rotation.DEG_90: this.matrix = this.matrix.rotateRight(); break;
            case Rotation.DEG_180: this.matrix = this.matrix.rotateRight().rotateRight(); break;
            case Rotation.DEG_270: this.matrix = this.matrix.rotateLeft(); break;
        }
    }

    protected attemptRotation(matrix: Matrix, offset: Vec2): boolean {
        if (this.playfield.collides(matrix, offset)) { return false; }
        this.offset = offset;
        this.matrix = matrix;
        return true;
    }

    public rotateLeft() {
        const newMatrix = this.matrix.rotateLeft();
        switch (this.rotation) {
            case Rotation.DEG_0:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -2)))
                ) {
                    this.rotation = Rotation.DEG_270;
                }
                return;
            case Rotation.DEG_90:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 2)))
                ) {
                    this.rotation = Rotation.DEG_0;
                }
                return;
            case Rotation.DEG_180:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -2)))
                ) {
                    this.rotation = Rotation.DEG_90;
                }
                return;
            case Rotation.DEG_270:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 2)))
                ) {
                    this.rotation = Rotation.DEG_180;
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
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -2)))
                ) {
                    this.rotation = Rotation.DEG_90;
                }
                return;
            case Rotation.DEG_90:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 2)))
                ) {
                    this.rotation = Rotation.DEG_180;
                }
                return;
            case Rotation.DEG_180:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, -2)))
                ) {
                    this.rotation = Rotation.DEG_270;
                }
                return;
            case Rotation.DEG_270:
                if (
                    this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(-1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(vec2(1, 2)))
                ) {
                    this.rotation = Rotation.DEG_0;
                }
                return;
        }
    }

    public moveLeft() {
        const newOffset = this.offset.add(vec2(-1, 0));
        if (this.playfield.collides(this.matrix, newOffset)) { return; }
        this.offset = newOffset;
    }

    public moveDown() {
        const newOffset = this.offset.add(vec2(0, -1));
        if (this.playfield.collides(this.matrix, newOffset)) { return; }
        this.offset = newOffset;
    }

    public moveRight() {
        const newOffset = this.offset.add(vec2(1, 0));
        if (this.playfield.collides(this.matrix, newOffset)) { return; }
        this.offset = newOffset;
    }

    public get hardDropOffset() {
        let newOffset = this.offset;
        while (!this.playfield.collides(this.matrix, newOffset.add(vec2(0, -1)))) {
            newOffset = newOffset.add(vec2(0, -1));
        }
        return newOffset;
    }

    public hardDrop() {
        this.offset = this.hardDropOffset;
    }

    public overlayedOnMatrix() {
        return this.playfield.overlay(this.matrix, this.offset);
    }

    public overlayedOnMatrixWithGhost() {
        return this.playfield
            .overlay(this.matrix.recolor(CellColor.GHOST), this.hardDropOffset)
            .overlay(this.matrix, this.offset);
    }

    public hasHitFloor() {
        return this.playfield.collides(this.matrix, this.offset.add(vec2(0, -1)));
    }
}
