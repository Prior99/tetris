import { component, inject, initialize, external } from "tsdi";
import { observable, computed } from "mobx";
import { bind } from "lodash-decorators";
import { GameState, ShuffleBag, Matrix, Garbage } from "game";
import { RemoteUsers, Networking, NetworkGame } from "networking";

@component @external
export class ObservableGame {
    @inject private gameState: GameState;
    @inject private shuffleBag: ShuffleBag;

    @observable public holdPiece: Matrix | undefined;
    @observable public score = 0;
    @observable public lines = 0;
    @observable public level = 0;
    @observable public toppedOut = false;
    @observable.shallow public incomingGarbage: Garbage[] = [];
    @observable.shallow public tetriminoPreview: Matrix[] = [];

    private interval: any;

    @initialize protected initialize() {
        this.interval = setInterval(this.update, 200);
        this.update();
    }

    protected componentWillUnmount() {
        clearInterval(this.interval);
    }

    private get incomingGarbageChanged() {
        if (this.incomingGarbage.length !== this.gameState.incomingGarbage.length) { return true; }
        return this.incomingGarbage.some((garbage, index) => {
            return this.gameState.incomingGarbage[index].lines !== garbage.lines;
        });
    }

    private get tetriminoPreviewChanged() {
        const { preview } = this.shuffleBag;
        if (this.tetriminoPreview.length !== preview.length) { return true; }
        return this.tetriminoPreview.some((current, index) => !current.equals(preview[index].matrix));
    }

    @bind private update() {
        this.holdPiece = this.gameState.holdPiece ? this.gameState.holdPiece.matrix : undefined;
        this.score = this.gameState.score;
        this.lines = this.gameState.lines;
        this.level = this.gameState.level;
        this.toppedOut = this.gameState.toppedOut;
        if (this.incomingGarbageChanged) {
            this.incomingGarbage = [ ...this.gameState.incomingGarbage ];
        }
        if (this.tetriminoPreviewChanged) {
            this.tetriminoPreview = [ ...this.shuffleBag.preview.map(({ matrix }) => matrix) ];
        }
    }
}
