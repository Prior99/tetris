import { component, inject, initialize } from "tsdi";
import { differenceInMilliseconds } from "date-fns";
import { bind } from "lodash-decorators";
import { ShuffleBag } from "./shuffle-bag";
import { Matrix } from "./matrix";
import { Config } from "./config";
import { speed } from "./speed";
import { tetriminos } from "./tetriminos";
import { vec2, Vec2 } from "./vec2";

@component
export class GameState {
    @inject private config: Config;

    public matrix: Matrix;
    public initialized: Date;
    public lastTick: Date;
    public level = 3;
    public lines = 0;
    public score = 0;
    public currentTetrimino: Matrix;
    public shuffleBag: ShuffleBag<Matrix>;
    public offset: Vec2;
    private running = false;
    private timeout?: number;

    @initialize
    protected initialize() {
        this.matrix = new Matrix(this.config.logicalSize);
        this.initialized = new Date();
        this.lastTick = new Date();
        this.shuffleBag = tetriminos();
        this.newTetrimino();
    }

    public get speed() {
        return speed(this.level);
    }

    private processMatrix() {
        const now = new Date();
        const diff = differenceInMilliseconds(now, this.lastTick) / 1000;
        if (diff > this.speed) {
            this.lastTick = now;
            this.checkCollision();
            this.moveTetrimino();
        }
    }

    @bind private update() {
        if (!this.running) { return; }
        this.processMatrix();
        this.timeout = setTimeout(this.update, this.config.tickSpeed * 1000);
    }

    public inputRotateRight() {
        const newTetrimino = this.currentTetrimino.rotateRight();
        if (!this.matrix.collides(newTetrimino, this.offset)) {
            this.currentTetrimino = newTetrimino;
        }
    }

    public inputMoveLeft() {
        const newOffset = this.offset.add(vec2(-1, 0));
        if (!this.matrix.collides(this.currentTetrimino, newOffset)) {
            this.offset = newOffset;
        }
    }

    public inputMoveRight() {
        const newOffset = this.offset.add(vec2(1, 0));
        if (!this.matrix.collides(this.currentTetrimino, newOffset)) {
            this.offset = newOffset;
        }
    }

    public inputHardDrop() {
        let newOffset = this.offset;
        while (!this.matrix.collides(this.currentTetrimino, newOffset.add(vec2(0, -1)))) {
            newOffset = newOffset.add(vec2(0, -1));
        }
        this.offset = newOffset;
    }

    private moveTetrimino() {
        this.offset = this.offset.add(vec2(0, -1));
    }

    private newTetrimino() {
        this.currentTetrimino = this.shuffleBag.take();
        this.offset = vec2(
            Math.floor((this.config.logicalSize.x - this.currentTetrimino.dimensions.x) / 2),
            this.config.logicalSize.y - this.currentTetrimino.dimensions.y,
        );
    }

    private commitTetrimino() {
        this.matrix = this.matrix.overlay(this.currentTetrimino, this.offset);
        this.matrix = this.matrix.removeHorizontals();
        this.newTetrimino();
    }

    private checkCollision() {
        if (this.matrix.collides(this.currentTetrimino, this.offset.add(vec2(0, -1)))) {
            this.commitTetrimino();
        }
    }

    public get temporaryState() {
        return this.matrix.overlay(this.currentTetrimino, this.offset);
    }

    public start() {
        this.running = true;
        this.update();
    }

    public stop() {
        this.running = false;
        if (typeof this.timeout === "number" && this.timeout > -1) { clearTimeout(this.timeout); }
    }
}
