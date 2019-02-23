import { component, inject, initialize } from "tsdi";
import { computed, observable } from "mobx";
import { differenceInMilliseconds } from "date-fns";
import { bind } from "lodash-decorators";
import { ShuffleBag } from "./shuffle-bag";
import { Config } from "config";
import { speed } from "./speed";
import { Tetrimino } from "./tetriminos";
import { Playfield } from "./playfield";
import {
    Sounds,
    musicSpeedForLevel,
    AudioMoveDown,
    AudioRotate,
    AudioHit,
    AudioScore1,
    AudioScore2,
    AudioScore3,
    AudioScore4,
    AudioLevelUp,
} from "audio";
import { ScoreAction, ScoreActionType, scorePointValue } from "./scoring";

@component
export class GameState {
    @inject private config: Config;
    @inject private shuffleBag: ShuffleBag;
    @inject private playfield: Playfield;
    @inject private sounds: Sounds;

    public initialized: Date;
    public lastTick: Date;
    @observable public lines = 0;
    @observable public score = 0;
    public debug = false;
    public current: {
        tetrimino: Tetrimino;
        softDrops: number;
        hardDrops: number;
    };
    private running = false;
    private timeout?: number;
    private comboCount = 0;
    private timeStarted?: Date;
    private lastHit?: Date;

    @initialize
    protected initialize() {
        this.initialized = new Date();
        this.lastTick = new Date();
        this.newTetrimino();
    }

    public get seconds() {
        if (!this.timeStarted) { return 0; }
        return differenceInMilliseconds(new Date(), this.timeStarted) / 100;
    }

    public get speed() { return speed(this.level); }

    private processMatrix() {
        const now = new Date();
        const diff = differenceInMilliseconds(now, this.lastTick) / 1000;
        if (diff > this.speed || this.current.hardDrops) {
            this.lastTick = now;
            if (this.current.tetrimino.hasHitFloor()) { this.commitTetrimino(); }
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

    @computed public get level() {
        const linesPerLevel = this.debug ? 2 : 10;
        return Math.floor(this.lines / linesPerLevel);
    }

    public inputRotateRight() {
        this.sounds.play(AudioRotate);
        this.current.tetrimino.rotateRight();
    }

    public inputRotateLeft() {
        this.sounds.play(AudioRotate);
        this.current.tetrimino.rotateLeft();
    }

    public inputMoveLeft() {
        this.current.tetrimino.moveLeft();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveRight() {
        this.current.tetrimino.moveRight();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveDown() {
        this.current.softDrops++;
        this.current.tetrimino.moveDown();
        this.sounds.play(AudioMoveDown);
    }

    public inputHardDrop() {
        this.current.hardDrops = this.current.tetrimino.hardDrop();
    }

    private moveTetrimino() { this.current.tetrimino.moveDown(); }

    private newTetrimino() {
        this.current = {
            tetrimino: this.shuffleBag.take(),
            softDrops: 0,
            hardDrops: 0,
        };
    }

    private handleLevelUp() {
        this.sounds.play(AudioLevelUp);
        setTimeout(() => {
            this.sounds.changeMusicSpeed(musicSpeedForLevel(this.level));
        }, 100);
    }

    private playScoreSound(count: number) {
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

    private commitTetrimino() {
        this.sounds.play(AudioHit);
        this.playfield.update(this.current.tetrimino.overlayedOnMatrix());
        const { matrix, count } = this.playfield.removeHorizontals();
        if (count > 0) {
            this.comboCount++;
            this.playfield.update(matrix);
            const oldLevel = this.level;
            this.lines += count;
            if (this.level > oldLevel) {
                this.handleLevelUp();
            } else {
                this.playScoreSound(count);
            }
            this.scoreLineCount(count);
        } else {
            const { level, comboCount } = this;
            if (this.comboCount >= 2) {
                this.awardScore({
                    action: ScoreActionType.COMBO,
                    level,
                    comboCount,
                });
                this.comboCount = 0;
            }
        }
        this.lastHit = new Date();
        this.newTetrimino();
    }

    public get timeSinceLastHit() {
        if (!this.lastHit) { return Number.POSITIVE_INFINITY; }
        return differenceInMilliseconds(new Date(), this.lastHit) / 1000;
    }

    public awardScore(action: ScoreAction) {
        this.score += scorePointValue(action);
    }

    public scoreLineCount(count: number) {
        const { level } = this;
        switch (count) {
            case 1: this.awardScore({ action: ScoreActionType.SINGLE, level });
            case 2: this.awardScore({ action: ScoreActionType.DOUBLE, level });
            case 3: this.awardScore({ action: ScoreActionType.TRIPLE, level });
            case 4: this.awardScore({ action: ScoreActionType.TETRIS, level });
        }
        if (this.current.hardDrops) {
            this.awardScore({ action: ScoreActionType.HARD_DROP, cells: this.current.hardDrops });
        }
        if (this.current.softDrops) {
            this.awardScore({ action: ScoreActionType.SOFT_DROP, cells: this.current.softDrops });
        }
    }

    public get temporaryState() { return this.current.tetrimino.overlayedOnMatrixWithGhost(); }

    public start() {
        this.running = true;
        this.update();
        this.timeStarted = new Date();
    }

    public stop() {
        this.running = false;
        if (typeof this.timeout === "number" && this.timeout > -1) { clearTimeout(this.timeout); }
    }
}
