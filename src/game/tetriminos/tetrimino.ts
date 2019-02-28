import { external, inject, initialize } from "tsdi";
import { vec2, Vec2 } from "utils";
import { Matrix } from "../matrix";
import { Playfield } from "../playfield";
import { CellColor } from "../cell-color";
import { Config } from "config";

export enum Rotation {
    DEG_0 = 0,
    DEG_90 = 1,
    DEG_180 = 2,
    DEG_270 = 3,
}

@external
export class Tetrimino {
    @inject private playfield: Playfield;
    @inject private config: Config;

    private ghostPosition: Vec2;

    constructor(
        public matrix: Matrix,
        public offset: Vec2,
        public rotation = Rotation.DEG_0,
    ) {}

    @initialize protected initialize() {
        switch (this.rotation) {
            case Rotation.DEG_0: break;
            case Rotation.DEG_90: this.matrix = this.matrix.rotateRight(); break;
            case Rotation.DEG_180: this.matrix = this.matrix.rotateRight().rotateRight(); break;
            case Rotation.DEG_270: this.matrix = this.matrix.rotateLeft(); break;
        }
    }

    public refreshGhostPosition() {
        this.ghostPosition = this.calculateHardDropOffset().offset;
    }

    protected attemptRotation(matrix: Matrix, offset: Vec2): boolean {
        if (this.playfield.collides(matrix, offset)) { return false; }
        this.offset = offset;
        this.matrix = matrix;
        return true;
    }

    public setRotation(rotation: Rotation) {
        this.rotation = rotation;
        this.refreshGhostPosition();
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
                    this.setRotation(Rotation.DEG_270);
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
                    this.setRotation(Rotation.DEG_0);
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
                    this.setRotation(Rotation.DEG_90);
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
                    this.setRotation(Rotation.DEG_180);
                }
                return;
        }
    }

    public moveSafeUp() {
        while (this.isStuck && this.offset.y <= this.config.visibleSize.y) {
            this.offset = this.offset.add(vec2(0, 1));
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
                    this.setRotation(Rotation.DEG_90);
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
                    this.setRotation(Rotation.DEG_180);
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
                    this.setRotation(Rotation.DEG_270);
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
                    this.setRotation(Rotation.DEG_0);
                }
                return;
        }
    }

    public moveLeft() {
        const newOffset = this.offset.add(vec2(-1, 0));
        if (this.playfield.collides(this.matrix, newOffset)) { return; }
        this.offset = newOffset;
        this.refreshGhostPosition();
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
        this.ghostPosition = this.calculateHardDropOffset().offset;
        this.refreshGhostPosition();
    }

    public calculateHardDropOffset() {
        let offset = this.offset;
        let count = 0;
        while (!this.playfield.collides(this.matrix, offset.add(vec2(0, -1)))) {
            offset = offset.add(vec2(0, -1));
            count++;
        }
        return { offset, count };
    }

    public hardDrop() {
        const { offset, count } = this.calculateHardDropOffset();
        this.offset = offset;
        return count;
    }

    public overlayedOnMatrix() {
        return this.playfield.overlay(this.matrix, this.offset);
    }

    public overlayedOnMatrixWithGhost() {
        return this.playfield
            .overlay(this.matrix.recolor(CellColor.GHOST), this.ghostPosition)
            .overlay(this.matrix, this.offset);
    }

    public hasHitFloor() {
        return this.playfield.collides(this.matrix, this.offset.add(vec2(0, -1)));
    }

    public get isStuck() {
        return this.playfield.collides(this.matrix, this.offset);
    }
}
