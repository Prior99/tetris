import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2 } from "utils";
import { Game } from "game";
import { Graphics } from "./graphics";
import {
    SpriteIncomingAlert,
    SpriteScoreDouble,
    SpriteScoreTriple,
    SpriteScoreTetris,
    Sprite,
} from "resources";
import { Constructable } from "types";

@component
export class Overlay extends Graphics {
    @inject private game: Game;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderIncomingAlert() {
        const sprite = this.sprites.sprite(SpriteIncomingAlert);
        const { latestIncomingGarbage } = this.game;
        if (!latestIncomingGarbage) { return; }
        const time = this.game.seconds - latestIncomingGarbage.time;
        const difference = this.config.garbageTimeout - sprite.totalDuration;
        if (time > difference && time < this.config.garbageTimeout) {
            this.renderSprite(
                SpriteIncomingAlert,
                vec2(0, 0),
                sprite.dimensions.mult(this.scaleFactor),
                time - difference,
            );
        }
    }

    private renderDouble() {
        const { timeSinceLastDouble } = this.game;
        if (!timeSinceLastDouble) { return; }
        this.renderScoreSplash(timeSinceLastDouble, SpriteScoreDouble);
    }

    private renderTriple() {
        const { timeSinceLastTriple } = this.game;
        if (!timeSinceLastTriple) { return; }
        this.renderScoreSplash(timeSinceLastTriple, SpriteScoreTriple);
    }

    private renderTetris() {
        const { timeSinceLastTetris } = this.game;
        if (!timeSinceLastTetris) { return; }
        this.renderScoreSplash(timeSinceLastTetris, SpriteScoreTetris);
    }

    private renderScoreSplash(lastTime: number, spriteClass: Constructable<Sprite>) {
        const sprite = this.sprites.sprite(spriteClass);
        const time = this.game.seconds - lastTime;
        const offset = this.pixelSize.sub(sprite.dimensions.mult(this.scaleFactor)).div(vec2(1, 2));
        if (time < sprite.totalDuration) {
            this.renderSprite(spriteClass, offset, sprite.dimensions.mult(this.scaleFactor), time);
        }
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalAlpha = 0.7;
        this.renderIncomingAlert();
        this.renderDouble();
        this.renderTriple();
        this.renderTetris();
    }
}
