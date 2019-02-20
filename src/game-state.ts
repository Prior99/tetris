import { component, inject, initialize } from "tsdi";
import { differenceInMilliseconds } from "date-fns";
import { bind } from "lodash-decorators";
import { ShuffleBag } from "./shuffle-bag";
import { Matrix } from "./matrix";
import { Config } from "./config";
import { speed } from "./speed";
import { Tetrimino } from "./tetrimino";
import { vec2, Vec2 } from "./vec2";
import { Playfield } from "./playfield";

@component
export class GameState {
    @inject private config: Config;
    @inject private shuffleBag: ShuffleBag;
    @inject private playfield: Playfield;

    public initialized: Date;
    public lastTick: Date;
    public level = 3;
    public lines = 0;
    public score = 0;
    public currentTetrimino: Tetrimino;
    private running = false;
    private timeout?: number;

    @initialize
    protected initialize() {
        this.initialized = new Date();
        this.lastTick = new Date();
        this.newTetrimino();
    }

    public get speed() { return speed(this.level); }

    private processMatrix() {
        const now = new Date();
        const diff = differenceInMilliseconds(now, this.lastTick) / 1000;
        if (diff > this.speed) {
            this.lastTick = now;
            if (this.currentTetrimino.hasHitFloor()) { this.commitTetrimino(); }
            this.moveTetrimino();
        }
    }

    @bind private update() {
        if (!this.running) { return; }
        this.processMatrix();
        this.timeout = setTimeout(this.update, this.config.tickSpeed * 1000);
    }

    public inputRotateRight() { this.currentTetrimino.rotateRight(); }

    public inputRotateLeft() { this.currentTetrimino.rotateLeft(); }

    public inputMoveLeft() { this.currentTetrimino.moveLeft(); }

    public inputMoveRight() { this.currentTetrimino.moveRight(); }

    public inputHardDrop() { this.currentTetrimino.hardDrop(); }

    private moveTetrimino() { this.currentTetrimino.moveDown(); }

    private newTetrimino() {
        this.currentTetrimino = this.shuffleBag.take();
    }

    private commitTetrimino() {
        this.playfield.update(this.currentTetrimino.overlayedOnMatrix());
        this.playfield.update(this.playfield.removeHorizontals());
        this.newTetrimino();
    }

    public get temporaryState() { return this.currentTetrimino.overlayedOnMatrix(); }

    public start() {
        this.running = true;
        this.update();
    }

    public stop() {
        this.running = false;
        if (typeof this.timeout === "number" && this.timeout > -1) { clearTimeout(this.timeout); }
    }
}
