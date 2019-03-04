import { differenceInMilliseconds } from "date-fns";
import { component, inject } from "tsdi";
import { EffectInfo, Garbage, GameMode, SoundsMode } from "types";
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

    public gameMode?: GameMode;
    public running = false;
    public serial: string;

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
        if (!this.gameState) { throw new Error("Can't retrieve level of uninitialized game."); }
        return this.gameState.level;
    }

    public get lines(): number {
        if (!this.gameState) { throw new Error("Can't retrieve lines of uninitialized game."); }
        return this.gameState.lines;
    }

    public get score(): number {
        if (!this.gameState) { throw new Error("Can't retrieve score of uninitialized game."); }
        return this.gameState.score;
    }

    public get toppedOut(): boolean {
        if (!this.gameState) { throw new Error("Can't retrieve topped out state of uninitialized game."); }
        return this.gameState.toppedOut;
    }

    public get lastHitPosition(): Vec2 | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve last hit position of uninitialized game."); }
        return this.gameState.lastHitPosition;
    }

    public get timeSinceLastHit(): number | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve time since last hit of uninitialized game."); }
        return this.gameState.timeSinceLastHit;
    }

    public get temporaryState(): Matrix {
        if (!this.gameState) { throw new Error("Can't retrieve temporary state of uninitialized game."); }
        return this.gameState.temporaryState;
    }

    public get effects(): EffectInfo<any>[] {
        if (!this.effectsController) { throw new Error("Can't retrieve effects of uninitialized game."); }
        return this.effectsController.effects;
    }

    public restart(seed?: string): void {
        if (!this.gameMode) { throw new Error("Restarted game that was not started previously."); }
        this.stop();
        this.start(this.gameMode, seed);
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
        if (!this.gameState) { throw new Error("Can't retrieve outgoing garbage of uninitialized game."); }
        return [ ...this.gameState.outgoingGarbage ];
    }

    public clearOutgoingGarbage(): void {
        if (!this.gameState) { throw new Error("Can't clear outgoing garbage on uninitialized game."); }
        this.gameState.outgoingGarbage = [];
    }

    public start(gameMode: GameMode, seed?: string): void {
        this.playfield = new Playfield();
        this.shuffleBag = new ShuffleBag(this.playfield, seed);
        this.effectsController = new Effects();
        this.gameState = new GameState(this.shuffleBag, this.playfield, this.effectsController);
        this.input = new Input(this.gameState);

        this.running = true;
        this.sounds.setMode(SoundsMode.GAME);
        this.gameMode = gameMode;
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
        if (!this.gameState || !this.input) { throw new Error("Tried to tick game that wasn't fully initialized."); }
        const now = new Date();
        const time = differenceInMilliseconds(now, this.timeStarted) / 1000;
        this.input.tick(time);
        this.gameState.tick(time);
        if (this.gameState.toppedOut) {
            this.stop();
        } else {
            this.timeout = setTimeout(() => this.tick(), this.config.tickSpeed * 1000);
        }
        this.timeLastTick = now;
    }

    public get incomingGarbage(): Garbage[] {
        if (!this.gameState) { throw new Error("Can't retrieve incoming garbage of uninitialized game."); }
        return [ ...this.gameState.incomingGarbage ];
    }

    public get holdPiece(): Matrix | undefined {
        if (!this.gameState) { throw new Error("Can't retrieve hold piece of uninitialized game."); }
        if (!this.gameState.holdPiece) { return; }
        return this.gameState.holdPiece.matrix;
    }

    public get latestIncomingGarbage() {
        if (!this.gameState) { throw new Error("Can't retrieve incoming garbage of uninitialized game."); }
        if (this.gameState.incomingGarbage.length === 0) { return; }
        return this.gameState.incomingGarbage[this.gameState.incomingGarbage.length - 1];
    }
}
