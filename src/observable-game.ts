import { component, inject, external } from "tsdi";
import { observable, computed } from "mobx";
import { bind } from "lodash-decorators";
import { Game } from "game";
import { GameMode, Garbage } from "types";
import { Matrix } from "utils";

@component @external
export class ObservableGame {
    @inject private game: Game;

    @observable public holdPiece: Matrix | undefined;
    @observable public score = 0;
    @observable public lines = 0;
    @observable public level = 0;
    @observable public gameOver = false;
    @observable public gameMode?: GameMode;
    @observable public seconds: number;
    @observable.shallow public incomingGarbage: Garbage[] = [];
    @observable.shallow public tetriminoPreview: Matrix[] = [];

    private interval: any;

    @computed public get isSinglePlayer() {
        return this.gameMode === GameMode.SINGLE_PLAYER;
    }

    protected componentWillUnmount() {
        clearInterval(this.interval);
    }

    private get incomingGarbageChanged() {
        if (this.incomingGarbage.length !== this.game.incomingGarbage.length) { return true; }
        return this.incomingGarbage.some((garbage, index) => {
            return this.game.incomingGarbage[index].lines !== garbage.lines;
        });
    }

    private get tetriminoPreviewChanged() {
        const { tetriminoPreviews } = this.game;
        if (this.tetriminoPreview.length !== tetriminoPreviews.length) { return true; }
        return this.tetriminoPreview.some((current, index) => !current.equals(tetriminoPreviews[index]));
    }

    @bind private update() {
        if (!this.game.running) {
            this.gameOver = true;
            return;
        }
        this.gameOver = false;
        this.holdPiece = this.game.holdPiece;
        this.score = this.game.score;
        this.lines = this.game.lines;
        this.level = this.game.level;
        this.gameMode = this.game.gameMode;
        this.seconds = this.game.seconds;
        if (this.incomingGarbageChanged) {
            this.incomingGarbage = [ ...this.game.incomingGarbage ];
        }
        if (this.tetriminoPreviewChanged) {
            this.tetriminoPreview = [ ...this.game.tetriminoPreviews ];
        }
    }

    public restart(seed: string): void {
        this.game.restart(seed);
    }

    public start(gameMode: GameMode.SINGLE_PLAYER): void;
    public start(gameMode: GameMode.MULTI_PLAYER, seed: string): void;
    public start(gameMode: GameMode, seed?: string): void {
        this.game.start(gameMode, seed);
        this.interval = setInterval(this.update, 100);
        this.update();
    }

    public stop() {
        this.game.stop();
        clearInterval(this.interval);
    }
}
