import { external, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { vec2, Vec2, Matrix } from "utils";
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
import { Sounds } from "sounds";
import {
    Garbage,
    EffectType,
    GameParameters,
    GarbageMode,
    GameOverReason,
    WinningConditionType,
    CellColor,
} from "types";
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
    public lastLockPosition?: Vec2;
    public lines = 0;
    public score = 0;
    public gameOverReason = GameOverReason.NONE;
    public holdPiece?: Tetrimino;
    public outgoingGarbage: Garbage[] = [];
    public incomingGarbage: Garbage[] = [];
    public comboCount = 0;
    public timeGameOver: undefined | number;

    private timeLastHit?: number;
    private timeLastLock?: number;
    private timeLastMoveDown = 0;
    private timeCurrent = 0;
    private toppedOutCount = 0;

    constructor(
        private shuffleBag: ShuffleBag,
        private playfield: Playfield,
        private effects: Effects,
        private parameters: GameParameters,
    ) {
        this.newTetrimino();
    }

    public tick(time: number) {
        this.timeCurrent = time;
        this.tickMatrix();
        this.tickGarbage();
        const timeOver = this.parameters.winningCondition.condition === WinningConditionType.SUM_IN_TIME &&
            time > this.parameters.winningCondition.seconds;
        if (timeOver) {
            this.setGameOver(GameOverReason.TIME_OVER);
        }
    }

    public get gameOver(): boolean {
        return this.gameOverReason !== GameOverReason.NONE;
    }

    private tickMatrix() {
        if (!this.current) { throw new Error("Ticked matrix but game was not initialized."); }
        if (this.gameOver) { return; }
        if (this.timeCurrent - this.timeLastMoveDown > this.speed || this.current.hardDrops) {
            this.timeLastMoveDown = this.timeCurrent;
            if (!this.current.tetrimino.hasHitFloor) {
                this.moveTetrimino();
            }
            if (this.current.tetrimino.hasHitFloor) {
                this.tickHitTetrimino();
            } else {
                this.timeLastHit = undefined;
                this.timeLastLock = undefined;
            }
        }
    }

    private tickHitTetrimino() {
        if (!this.hasHit) {
            this.timeLastHit = this.timeCurrent;
        }
        if (this.timeSinceLastHit! > this.config.lockTime) {
            this.commitTetrimino();
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

    public get level() {
        if (this.parameters.levelUpDisabled) {
            return this.parameters.initialLevel;
        }
        return this.parameters.initialLevel + Math.floor(this.lines / 10);
    }

    @bind public inputRotateRight() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.sounds.play(AudioRotateRight);
        this.current.tetrimino.rotateRight();
    }

    @bind public inputRotateLeft() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.sounds.play(AudioRotateLeft);
        this.current.tetrimino.rotateLeft();
    }

    @bind public inputMoveLeft() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.tetrimino.moveLeft();
        this.sounds.play(AudioMoveDown);
    }

    @bind public inputMoveRight() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.tetrimino.moveRight();
        this.sounds.play(AudioMoveDown);
    }

    @bind public inputMoveDown() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.softDrops++;
        this.current.tetrimino.moveDown();
        this.sounds.play(AudioMoveDown);
    }

    @bind public inputHardDrop() {
        if (!this.current) { throw new Error("Received input event on uninitialized game state."); }
        this.current.hardDrops = this.current.tetrimino.hardDrop();
        this.commitTetrimino();
    }

    @bind public inputHoldPiece() {
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

    public gameOverOtherUserHasWon() {
        this.setGameOver(GameOverReason.OTHER_USER_HAS_WON);
    }

    public gameOverLastManStanding() {
        this.setGameOver(GameOverReason.LAST_MAN_STANDING);
    }

    private moveTetrimino() {
        if (!this.current) { throw new Error("Tried to move tetrimino down on uninitialized game state."); }
        this.current.tetrimino.moveDown();
    }

    private reset() {
        this.lines = 0;
        this.comboCount = 0;
        this.timeLastHit = undefined;
        this.timeLastLock = undefined;
        this.holdPiece = undefined;
        this.lastLockPosition = undefined;
        this.playfield.clear();
    }

    private handleToppedOut() {
        this.toppedOutCount++;
        switch (this.parameters.winningCondition.condition) {
            case WinningConditionType.SUM_IN_TIME: {
                this.reset();
                break;
            }
            case WinningConditionType.BATTLE_ROYALE: {
                if (this.toppedOutCount >= this.parameters.winningCondition.lives) {
                    this.setGameOver(GameOverReason.TOPPED_OUT);
                } else {
                    this.reset();
                }
                break;
            }
            case WinningConditionType.CLEAR_GARBAGE:
            case WinningConditionType.HIGHEST_SCORE_ONE_GAME: {
                this.setGameOver(GameOverReason.TOPPED_OUT);
                break;
            }
        }
    }

    private newTetrimino() {
        const tetrimino = this.shuffleBag.take();
        if (tetrimino.isStuck) {
            this.handleToppedOut();
            tetrimino.refreshGhostPosition();
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

    private calculateReturnedGarbage(clearedGarbageLines: number): number {
        switch (this.parameters.garbageMode) {
            case GarbageMode.FULL_REFERRED: return clearedGarbageLines;
            case GarbageMode.HALF_REFERRED: return Math.floor(clearedGarbageLines / 2);
            case GarbageMode.INITIAL_ONLY: return 0;
        }
        return 0;
    }

    private createOutgoingGarbage(count: number) {
        const clearedGarbageLines = this.cancelIncomingGarbage(count);
        const lines = calculateGarbage(count) + this.calculateReturnedGarbage(clearedGarbageLines);
        if (lines > 0 && this.parameters.garbageMode !== GarbageMode.NONE) {
            this.outgoingGarbage.push({ time: this.timeCurrent, lines });
        }
        if (this.comboCount >= 2) {
            this.effects.reportCombo(this.comboCount);
        }
    }

    private endCombo() {
        const { level, comboCount } = this;
        this.effects.clearCombo();
        this.comboCount = 0;
        if (this.comboCount >= 2) {
            this.awardScore({
                action: ScoreActionType.COMBO,
                level,
                comboCount,
            });
        }
    }

    private checkClearGarbageGameOver() {
        if (this.parameters.winningCondition.condition !== WinningConditionType.CLEAR_GARBAGE) {
            return;
        }
        if (!this.playfield.hasAny(CellColor.GARBAGE)) {
            this.setGameOver(GameOverReason.GARBAGE_CLEARED);
        }
    }

    private setGameOver(reason: GameOverReason) {
        this.gameOverReason = reason;
        this.timeGameOver = this.timeCurrent;
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
            this.createOutgoingGarbage(count);
            this.checkClearGarbageGameOver();
            offsets.forEach(y => this.effects.report({ effect: EffectType.LINE_CLEARED, y }));
        } else {
            this.endCombo();
        }
        this.lastLockPosition = tetrimino.offset.add(vec2(tetrimino.matrix.dimensions.x / 2, 0));
        this.newTetrimino();
        this.timeLastLock = this.timeCurrent;
        this.timeLastHit = undefined;
    }

    public get timeSinceLastHit(): number | undefined {
        if (!this.timeLastHit) { return; }
        return this.timeCurrent - this.timeLastHit;
    }

    public get timeSinceLastLock(): number | undefined {
        if (!this.timeLastLock) { return; }
        return this.timeCurrent - this.timeLastLock;
    }

    public get hasHit(): boolean {
        return this.timeLastHit !== undefined;
    }

    public awardScore(action: ScoreAction) {
        this.score += scorePointValue(action);
    }

    public scoreLineCount(count: number) {
        if (!this.current) { throw new Error("Can't score on uninitialized game state."); }
        this.effects.reportLines(count);
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

    public get temporaryState(): Matrix {
        if (!this.current) {
            return this.playfield;
        }
        return this.current.tetrimino.overlayedOnMatrixWithGhost;
    }
}
