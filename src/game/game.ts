import { differenceInMilliseconds } from "date-fns";
import * as Random from "random-seed";
import { component, inject } from "tsdi";
import { GameOverReason, EffectInfo, Garbage, SoundsMode, GameParameters } from "types";
import { Matrix, Vec2 } from "utils";
import { Config } from "config";
import { Sounds } from "sounds";
import { GameState } from "./game-state";
import { ShuffleBag } from "./shuffle-bag";
import { Input } from "./input";
import { Effects } from "./effects";
import { Playfield } from "./playfield";
import * as Uuid from "uuid";

@component
export class Game {
    @inject private sounds: Sounds;
    @inject private config: Config;

    private gameState?: GameState;
    private input?: Input;
    private shuffleBag?: ShuffleBag;
    private effectsController?: Effects;
    private playfield?: Playfield;
    private random: Random.RandomSeed;

    public running = false;
    public serial: string;
    public parameters: GameParameters;

    private timeStarted?: Date;
    private timeLastTick?: Date;
    private timeout: any;

    public get seconds(): number {
        if (!this.timeLastTick || !this.timeStarted) { return 0; }
        return differenceInMilliseconds(this.timeLastTick, this.timeStarted) / 1000;
    }

    public get tetriminoPreviews(): Matrix[] {
        if (!this.running || !this.shuffleBag) { return []; }
        return this.shuffleBag.preview.map(({ matrix }) => matrix);
    }

    public get level(): number {
        if (!this.gameState) { throw new Error("Can't retrieve level."); }
        return this.gameState.level;
    }

    public get lines(): number {
        if (!this.gameState) { throw new Error("Can't retrieve lines."); }
        return this.gameState.lines;
    }

    public get score(): number {
        if (!this.gameState) { throw new Error("Can't retrieve score."); }
        return this.gameState.score;
    }

    public get gameOver(): boolean {
        if (!this.gameState) { throw new Error("Can't retrieve game over state."); }
        return this.gameState.gameOver;
    }

    public get gameOverReason(): GameOverReason {
        if (!this.gameState) { throw new Error("Can't retrieve game over state."); }
        return this.gameState.gameOverReason;
    }

    public get tetriminoOffset(): Vec2 | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve tetrimino offset."); }
        if (!this.gameState.current) { return; }
        return this.gameState.current.tetrimino.offset;
    }

    public get lastLockPosition(): Vec2 | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve last hit position."); }
        return this.gameState.lastLockPosition;
    }

    public get hasHit(): boolean | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve whether tetrimino has hit."); }
        return this.gameState.hasHit;
    }

    public get timeSinceLastLock(): number | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve time since last lock."); }
        return this.gameState.timeSinceLastLock;
    }

    public get timeSinceLastHit(): number | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve time since last hit."); }
        return this.gameState.timeSinceLastHit;
    }

    public get timeSinceLastDouble(): number | undefined {
        if (!this.effectsController) { throw new Error("Can't retrieve time since last double."); }
        return this.effectsController.timeSinceLastDouble;
    }

    public get timeSinceLastTriple(): number | undefined {
        if (!this.effectsController) { throw new Error("Can't retrieve time since last triple."); }
        return this.effectsController.timeSinceLastTriple;
    }

    public get timeSinceLastTetris(): number | undefined {
        if (!this.effectsController) { throw new Error("Can't retrieve time since last tetris."); }
        return this.effectsController.timeSinceLastTetris;
    }

    public get timeSinceComboStart() {
        if (!this.effectsController) { throw new Error("Can't retrieve time since combo start."); }
        const { comboCounts } = this.effectsController;
        if (comboCounts.length === 0) { return; }
        return comboCounts[0].time;
    }

    public get timeSinceComboEnd() {
        if (!this.effectsController) { throw new Error("Can't retrieve time since combo end."); }
        return this.effectsController.timeSinceLastTetris;
    }

    public get comboCounts(): { count: number, time: number}[] {
        if (!this.effectsController) { throw new Error("Can't combos."); }
        return this.effectsController.comboCounts;
    }

    public get temporaryState(): Matrix {
        if (!this.gameState) { throw new Error("Can't retrieve temporary state."); }
        return this.gameState.temporaryState;
    }

    public get effects(): EffectInfo<any>[] {
        if (!this.effectsController) { throw new Error("Can't retrieve effects."); }
        return this.effectsController.effects;
    }

    public restart(parameters: GameParameters): void {
        if (!this.parameters.gameMode) { throw new Error("Restarted game that was not started previously."); }
        this.stop();
        this.start(parameters);
    }

    public addIncomingGarbage(garbage: Garbage): void {
        if (!this.gameState) { throw new Error("Can't add garbage to uninitialized game."); }
        this.gameState.addIncomingGarbage(garbage);
    }

    public get hasOutgoingGarbage(): boolean {
        if (!this.gameState) { throw new Error("Can't check garbage on uninitialized game."); }
        return this.gameState.outgoingGarbage.length > 0;
    }

    public get outgoingGarbage(): Garbage[] {
        if (!this.gameState) { throw new Error("Can't retrieve outgoing garbage."); }
        return [ ...this.gameState.outgoingGarbage ];
    }

    public clearOutgoingGarbage(): void {
        if (!this.gameState) { throw new Error("Can't clear outgoing garbage on uninitialized game."); }
        this.gameState.outgoingGarbage = [];
    }

    public start(parameters: GameParameters): void {
        this.parameters = parameters;
        this.random = Random.create(parameters.seed);
        this.playfield = new Playfield(this.random);
        this.playfield.addGarbageLines(parameters.initialGarbageLines);
        this.shuffleBag = new ShuffleBag(this.playfield, parameters.seed);
        this.effectsController = new Effects();
        this.gameState = new GameState(this.shuffleBag, this.playfield, this.effectsController, this.parameters);
        this.input = new Input(this.gameState);
        this.running = true;
        this.sounds.setMode(SoundsMode.GAME);
        this.timeStarted = new Date();
        this.tick();
        this.serial = Uuid.v4();
    }

    public stop() {
        if (this.input === undefined) { throw new Error("Tried to stop game that wasn't fully initialized."); }
        clearTimeout(this.timeout);
        this.running = false;
        this.timeStarted = undefined;
        this.timeLastTick = undefined;
        this.sounds.setMode(SoundsMode.MENU);
        this.input.disable();
    }

    private tick() {
        if (!this.timeStarted) { throw new Error("Ticked but game was not started."); }
        if (!this.gameState || !this.input || !this.effectsController) {
            throw new Error("Tried to tick game that wasn't fully initialized.");
        }
        const now = new Date();
        const time = differenceInMilliseconds(now, this.timeStarted) / 1000;
        this.effectsController.tick(time);
        this.input.tick(time);
        this.gameState.tick(time);
        if (this.gameState.gameOver) {
            this.stop();
        } else {
            this.timeout = setTimeout(() => this.tick(), this.config.tickSpeed * 1000);
        }
        this.timeLastTick = now;
    }

    public get incomingGarbage(): Garbage[] {
        if (!this.gameState) { throw new Error("Can't retrieve incoming garbage."); }
        return [ ...this.gameState.incomingGarbage ];
    }

    public get holdPiece(): Matrix | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve hold piece."); }
        if (!this.gameState.holdPiece) { return; }
        return this.gameState.holdPiece.matrix;
    }

    public get latestIncomingGarbage() {
        if (!this.gameState) { throw new Error("Can't retrieve incoming garbage."); }
        if (this.gameState.incomingGarbage.length === 0) { return; }
        return this.gameState.incomingGarbage[0];
    }

    public gameOverLastManStanding() {
        if (!this.gameState) { throw new Error("Can't set uninitialized game to be game over."); }
        this.gameState.gameOverLastManStanding();
    }

    public gameOverOtherUserHasWon() {
        if (!this.gameState) { throw new Error("Can't set uninitialized game to be game over."); }
        this.gameState.gameOverOtherUserHasWon();
    }

    public get timeGameOver() {
        if (!this.gameState) { throw new Error("Can't retrieve game over time."); }
        return this.gameState.timeGameOver;
    }
}
