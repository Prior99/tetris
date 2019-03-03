import { component, inject } from "tsdi";
import { EffectInfo, Garbage, GameMode } from "types";
import { Matrix, Vec2 } from "utils";
import { Sounds } from "sounds";
import { GameState } from "./game-state";
import { ShuffleBag } from "./shuffle-bag";
import { Input } from "./input";
import { Effects } from "./effects";
import { Playfield } from "./playfield";

@component
export class Game {
    @inject private gameState: GameState;
    @inject private input: Input;
    @inject private shuffleBag: ShuffleBag;
    @inject private effectsController: Effects;
    @inject private playfield: Playfield;
    @inject private sounds: Sounds;

    public started = false;

    public get tetriminoPreviews(): Matrix[] {
        if (!this.started) { return []; }
        return this.shuffleBag.preview.map(({ matrix }) => matrix);
    }

    public get level(): number {
        return this.gameState.level;
    }

    public get lines(): number {
        return this.gameState.lines;
    }

    public get score(): number {
        return this.gameState.score;
    }

    public get toppedOut(): boolean {
        return this.gameState.toppedOut;
    }

    public get lastHitPosition(): Vec2 | undefined {
        return this.gameState.lastHitPosition;
    }

    public get timeSinceLastHit(): number {
        return this.gameState.timeSinceLastHit;
    }

    public get temporaryState(): Matrix {
        return this.gameState.temporaryState;
    }

    public get effects(): EffectInfo<any>[] {
        return this.effectsController.effects;
    }

    public restart(seed?: string): void {
        this.gameState.reset();
        this.playfield.reset();
        this.shuffleBag.reset(seed);
    }

    public addIncomingGarbage(garbage: Garbage): void {
        this.gameState.addIncomingGarbage(garbage);
    }

    public get hasOutgoingGarbage(): boolean {
        return this.gameState.outgoingGarbage.length > 0;
    }

    public get outgoingGarbage(): Garbage[] {
        return [ ...this.gameState.outgoingGarbage ];
    }

    public clearOutgoingGarbage(): void {
        this.gameState.outgoingGarbage = [];
    }

    public start(gameMode: GameMode, seed?: string): void {
        this.shuffleBag.seed(seed);
        this.sounds.startGame();
        this.gameState.start();
        this.input.enable();
        this.started = true;
    }

    public get incomingGarbage(): Garbage[] {
        return [ ...this.gameState.incomingGarbage ];
    }

    public get holdPiece(): Matrix | undefined {
        if (!this.gameState.holdPiece) { return; }
        return this.gameState.holdPiece.matrix;
    }
}
