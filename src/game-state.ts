import { component, inject, initialize } from "tsdi";
import { differenceInMilliseconds } from "date-fns";
import { bind } from "lodash-decorators";
import { ShuffleBag } from "./shuffle-bag";
import { Config } from "./config";
import { speed } from "./speed";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "./playfield";
import { Sounds } from "./sounds";
import {
    AudioMoveDown,
    AudioRotate,
    AudioHit,
    AudioScore1,
    AudioScore2,
    AudioScore3,
    AudioScore4,
    AudioMusic120Bpm,
    AudioLevelUp,
} from "./audios";

@component
export class GameState {
    @inject private config: Config;
    @inject private shuffleBag: ShuffleBag;
    @inject private playfield: Playfield;
    @inject private sounds: Sounds;

    public initialized: Date;
    public lastTick: Date;
    public lines = 60;
    public score = 0;
    public debug = false;
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
        if (this.debug) {
            console.log(this.temporaryState.toString()); // tslint:disable-line
        }
    }

    public get level() {
        return Math.floor(this.lines / 10);
    }

    public inputRotateRight() {
        this.sounds.play(AudioRotate);
        this.currentTetrimino.rotateRight();
    }

    public inputRotateLeft() {
        this.sounds.play(AudioRotate);
        this.currentTetrimino.rotateLeft();
    }

    public inputMoveLeft() {
        this.currentTetrimino.moveLeft();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveRight() {
        this.currentTetrimino.moveRight();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveDown() {
        this.currentTetrimino.moveDown();
        this.sounds.play(AudioMoveDown);
    }

    public inputHardDrop() { this.currentTetrimino.hardDrop(); }

    private moveTetrimino() { this.currentTetrimino.moveDown(); }

    private newTetrimino() {
        this.currentTetrimino = this.shuffleBag.take();
    }

    private commitTetrimino() {
        this.sounds.play(AudioHit);
        this.playfield.update(this.currentTetrimino.overlayedOnMatrix());
        const { matrix, count } = this.playfield.removeHorizontals();
        this.playfield.update(matrix);
        const oldLevel = this.level;
        this.lines += count;
        if (this.level > oldLevel) {
            this.sounds.play(AudioLevelUp);
        } else {
            switch (count) {
                default:
                case 0:
                    break;
                case 1:
                    this.sounds.play(AudioScore1);
                    break;
                case 2:
                    this.sounds.play(AudioScore2);
                    break;
                case 3:
                    this.sounds.play(AudioScore3);
                    break;
                case 4:
                    this.sounds.play(AudioScore4);
                    break;
            }
        }
        this.newTetrimino();
    }

    public get temporaryState() { return this.currentTetrimino.overlayedOnMatrixWithGhost(); }

    public start() {
        this.running = true;
        this.update();
        this.sounds.loop(AudioMusic120Bpm);
    }

    public stop() {
        this.running = false;
        if (typeof this.timeout === "number" && this.timeout > -1) { clearTimeout(this.timeout); }
    }
}
