import { external, inject } from "tsdi";
import { Config } from "config";
import { vec2, Vec2 } from "utils";
import {
    AudioMoveDown,
    AudioRotateLeft,
    AudioRotateRight,
    AudioIncomingWarning,
    AudioIncomingCommitted,
    AudioHit,
    AudioScore1,
    AudioScore2,
    AudioScore3,
    AudioScore4,
    AudioLevelUp,
} from "resources";
import { musicSpeedForLevel, Sounds } from "sounds";
import { Garbage, EffectType } from "types";
import { ScoreAction, ScoreActionType, scorePointValue } from "./scoring";
import { Effects } from "./effects";
import { speed } from "./speed";
import { Tetrimino } from "./tetriminos";
import { Playfield } from "./playfield";
import { ShuffleBag } from "./shuffle-bag";

function calculateGarbage(lines: number): number {
    switch (lines) {
        case 1: return 0;
        case 2: return 1;
        case 3: return 2;
        default: return lines;
    }
}

@external
export class GameState {
    @inject private config: Config;
    @inject private sounds: Sounds;

    public current?: {
        tetrimino: Tetrimino;
        softDrops: number;
        hardDrops: number;
        usedHoldPiece: boolean;
    };
    public lastHitPosition?: Vec2;
    public lines = 0;
    public score = 0;
    public toppedOut = false;
    public holdPiece?: Tetrimino;
    public outgoingGarbage: Garbage[] = [];
    public incomingGarbage: Garbage[] = [];
    public comboCount = 0;

    private timeLastHit = 0;
    private timeLastMoveDown = 0;
    private timeCurrent = 0;

    constructor(
        private shuffleBag: ShuffleBag,
        private playfield: Playfield,
        private events: Effects,
    ) {
        this.newTetrimino();
    }

    public tick(time: number) {
        this.timeCurrent = time;
        this.tickMatrix();
        this.tickGarbage();
    }

    private tickMatrix() {
        if (!this.current) { throw new Error("Ticked matrix but game was not initialized."); }
        if (this.toppedOut) { return; }
        if (this.timeCurrent - this.timeLastMoveDown > this.speed || this.current.hardDrops) {
            this.timeLastMoveDown = this.timeCurrent;
            if (this.current.tetrimino.hasHitFloor) { this.commitTetrimino(); }
            this.moveTetrimino();
        }
    }

    private tickGarbage() {
        if (!this.current) { throw new Error("Ticked matrix but game was not initialized."); }
        const relevantGarbage = this.incomingGarbage.filter(garbage => this.isGarbageTimeout(garbage));
        if (relevantGarbage.length === 0) { return; }
        this.sounds.play(AudioIncomingCommitted);
        relevantGarbage.forEach(garbage => this.playfield.addGarbageLines(garbage.lines));
        this.incomingGarbage = this.incomingGarbage.filter(garbage => !this.isGarbageTimeout(garbage));
        this.current.tetrimino.refreshGhostPosition();
        this.current.tetrimino.moveSafeUp();
    }

    private isGarbageTimeout(garbage: Garbage): boolean {
        return this.timeCurrent - garbage.time > this.config.garbageTimeout;
    }

    public addIncomingGarbage(garbage: Garbage) {
        garbage.time = this.timeCurrent;
        this.incomingGarbage.push(garbage);
        this.sounds.play(AudioIncomingWarning);
    }

    public get speed() { return speed(this.level); }

    public get level() { return Math.floor(this.lines / 10); }

    public inputRotateRight() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.sounds.play(AudioRotateRight);
        this.current.tetrimino.rotateRight();
    }

    public inputRotateLeft() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.sounds.play(AudioRotateLeft);
        this.current.tetrimino.rotateLeft();
    }

    public inputMoveLeft() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.tetrimino.moveLeft();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveRight() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.tetrimino.moveRight();
        this.sounds.play(AudioMoveDown);
    }

    public inputMoveDown() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.softDrops++;
        this.current.tetrimino.moveDown();
        this.sounds.play(AudioMoveDown);
    }

    public inputHardDrop() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.hardDrops = this.current.tetrimino.hardDrop();
    }

    public inputHoldPiece() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        if (this.current.usedHoldPiece) { return; }
        const currentHoldPiece = this.holdPiece;
        this.holdPiece = this.current.tetrimino;
        if (currentHoldPiece) {
            currentHoldPiece.reset();
            this.current = {
                tetrimino: currentHoldPiece,
                softDrops: 0,
                hardDrops: 0,
                usedHoldPiece: true,
            };
        } else {
            this.newTetrimino();
        }
    }

    private moveTetrimino() {
        if (!this.current) { throw new Error("Tried to move tetrimino down on uninitialized game state."); }
        this.current.tetrimino.moveDown();
    }

    private newTetrimino() {
        const tetrimino = this.shuffleBag.take();
        if (tetrimino.hasHitFloor) {
            this.toppedOut = true;
            return;
        }
        this.current = {
            tetrimino,
            softDrops: 0,
            hardDrops: 0,
            usedHoldPiece: false,
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
            case 0: break;
            case 1: this.sounds.play(AudioScore1); break;
            case 2: this.sounds.play(AudioScore2); break;
            case 3: this.sounds.play(AudioScore3); break;
            case 4: this.sounds.play(AudioScore4); break;
        }
    }

    private cancelIncomingGarbage(count: number): number {
        let cancelled = 0;
        while (count > 0) {
            if (this.incomingGarbage.length === 0) { return cancelled; }
            const incoming = this.incomingGarbage[this.incomingGarbage.length - 1];
            cancelled += incoming.lines;
            if (incoming.lines > count) {
                incoming.lines -= count;
                break;
            } else {
                this.incomingGarbage.pop();
                count -= incoming.lines;
            }
        }
        return cancelled;
    }

    private commitTetrimino() {
        if (!this.current) { throw new Error("Can't commit tetrimino on uninitialized game state."); }
        this.sounds.play(AudioHit);
        const { tetrimino } = this.current;
        this.playfield.update(tetrimino.overlayedOnMatrix);
        const { matrix, offsets } = this.playfield.removeHorizontals();
        const count = offsets.length;
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
            const clearedGarbageLines = this.cancelIncomingGarbage(count);
            const lines = calculateGarbage(count) + Math.floor(clearedGarbageLines / 2);
            if (lines > 0) {
                this.outgoingGarbage.push({ time: this.timeCurrent, lines });
            }
            offsets.forEach(y => this.events.report({ effect: EffectType.LINE_CLEARED, y }));
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
        this.timeLastHit = this.timeCurrent;
        this.lastHitPosition = tetrimino.offset.add(vec2(tetrimino.matrix.dimensions.x / 2, 0));
        this.newTetrimino();
    }

    public get timeSinceLastHit(): number | undefined {
        return this.timeCurrent - this.timeLastHit;
    }

    public awardScore(action: ScoreAction) {
        this.score += scorePointValue(action);
    }

    public scoreLineCount(count: number) {
        if (!this.current) { throw new Error("Can't score on uninitialized game state."); }
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

    public get temporaryState() {
        if (!this.current) {
            return this.playfield;
        }
        return this.current.tetrimino.overlayedOnMatrixWithGhost;
    }
}
