import { component, inject, initialize } from "tsdi";
import { differenceInMilliseconds } from "date-fns";
import { bind } from "lodash-decorators";
import { ShuffleBag } from "./shuffle-bag";
import { Matrix } from "./matrix";
import { Input } from "./input";
import { Config } from "./config";
import { speed } from "./speed";
import { tetriminos } from "./tetriminos";
import { vec2, Vec2 } from "./vec2";

@component
export class GameState {
    @inject private input: Input;
    @inject private config: Config;

    public matrix: Matrix;
    public initialized: Date;
    public lastTick: Date;
    public lastInput: Date;
    public level = 0;
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
        this.lastInput = new Date();
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
            console.log(this.offset.y);
            this.lastTick = now;
            this.checkCollision();
            this.moveTetrimino();
        }
    }

    @bind private update() {
        if (!this.running) { return; }
        this.processInput();
        this.processMatrix();
        this.timeout = setTimeout(this.update, this.config.tickSpeed * 1000);
    }

    private processInput() {
        const now = new Date();
        const diff = differenceInMilliseconds(now, this.lastInput) / 1000;
        if (diff > this.config.inputSpeed) {
            this.lastInput = now;
            if (this.input.moveLeft && this.offset.x > 0) {
                this.offset = this.offset.add(vec2(-1, 0));
            }
            if (this.input.moveRight && this.offset.x + this.currentTetrimino.dimensions.x < this.config.logicalSize.x) {
                this.offset = this.offset.add(vec2(1, 0));
            }
            if (this.input.rotate) {
                this.currentTetrimino = this.currentTetrimino.rotateRight();
            }
        }
    }

    private moveTetrimino() {
        this.offset = this.offset.add(vec2(0, -1));
    }

    private newTetrimino() {
        this.currentTetrimino = this.shuffleBag.take();
        this.offset = vec2(
            Math.floor((this.config.logicalSize.x - this.currentTetrimino.dimensions.x) / 2),
            this.config.logicalSize.y - 5,
        );
    }

    private commitTetrimino() {
        this.matrix = this.matrix.overlay(this.currentTetrimino, this.offset);
        this.matrix = this.matrix.removeHorizontals();
        this.newTetrimino();
    }

    private checkCollision() {
        const collides = (
            (this.offset.y === 0) ||
            (this.matrix.collides(this.currentTetrimino, this.offset.add(vec2(0, -1))))
        );
        if (collides) {
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
