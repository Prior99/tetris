import { component, inject } from "tsdi";
import { differenceInMilliseconds } from "date-fns";
import { ShuffleBag } from "./shuffle-bag";
import { Matrix } from "./matrix";
import { Input } from "./input";
import { speed } from "./speed";
import { tetriminos } from "./tetriminos";
import { vec2, Vec2 } from "./vec2";

@component
export class GameState {
    @inject private input: Input;

    public matrix: Matrix;
    public initialized: Date;
    public lastTick: Date;
    public level = 0;
    public lines = 0;
    public score = 0;
    public currentTetrimino: Matrix;
    public shuffleBag: ShuffleBag<Matrix>;
    public offset: Vec2;

    constructor(public width: number, public height: number) {
        this.matrix = new Matrix(width, height);
        this.initialized = new Date();
        this.lastTick = new Date();
        this.shuffleBag = tetriminos();
        this.newTetrimino();
    }

    public get speed() {
        return speed(this.level);
    }

    public update() {
        const now = new Date();
        const diff = differenceInMilliseconds(now, this.lastTick);
        this.processInput();
        if (diff > this.speed) {
            this.lastTick = now;
            this.checkCollision();
            this.moveTetrimino();
        }
    }

    private processInput() {
        if (this.input.moveLeft) {
            this.offset = this.offset.add(vec2(-1, 0));
        }
        if (this.input.moveRight) {
            this.offset = this.offset.add(vec2(1, 0));
        }
        if (this.input.rotate) {
            this.currentTetrimino = this.currentTetrimino.rotateRight();
        }
    }

    private moveTetrimino() {
        this.offset = this.offset.add(vec2(0, -1));
    }

    private newTetrimino() {
        this.currentTetrimino = this.shuffleBag.take();
        this.offset = vec2(Math.floor((this.width - this.currentTetrimino.width) / 2), this.height);
    }

    private checkCollision() {
        if (this.matrix.collides(this.currentTetrimino, this.offset.add(vec2(0, 1)))) {
            this.matrix = this.matrix.overlay(this.currentTetrimino, this.offset);
            this.matrix = this.matrix.removeHorizontals();
            this.newTetrimino();
        }
    }
}
