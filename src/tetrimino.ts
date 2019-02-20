import { external, inject } from "tsdi";
import { vec2, Vec2 } from "./vec2";
import { Matrix } from "./matrix";
import { Playfield } from "./playfield";

@external
export class Tetrimino {
    @inject private playfield: Playfield;

    constructor(
        public matrix: Matrix,
        public offset: Vec2,
    ) {}

    public rotateLeft() {
        const newMatrix = this.matrix.rotateLeft();
        if (this.playfield.collides(newMatrix, this.offset)) { return; }
        this.matrix = newMatrix;
    }

    public rotateRight() {
        const newMatrix = this.matrix.rotateRight();
        if (this.playfield.collides(newMatrix, this.offset)) { return; }
        this.matrix = newMatrix;
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

    public hardDrop() {
        let newOffset = this.offset;
        while (!this.playfield.collides(this.matrix, newOffset.add(vec2(0, -1)))) {
            newOffset = newOffset.add(vec2(0, -1));
        }
        this.offset = newOffset;
    }

    public overlayedOnMatrix() {
        return this.playfield.overlay(this.matrix, this.offset);
    }

    public hasHitFloor() {
        return this.playfield.collides(this.matrix, this.offset.add(vec2(0, -1)));
    }
}
