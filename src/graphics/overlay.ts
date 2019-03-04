import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2 } from "utils";
import { Game } from "game";
import { Graphics } from "./graphics";
import { SpriteIncomingAlert } from "resources";

@component
export class Overlay extends Graphics {
    @inject private game: Game;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    @bind public render() {
        this.renderClear();
        const sprite = this.sprites.sprite(SpriteIncomingAlert);
        const { latestIncomingGarbage } = this.game;
        if (!latestIncomingGarbage) { return; }
        this.ctx.globalAlpha = 0.5;
        const time = this.game.seconds - latestIncomingGarbage.time;
        const difference = this.config.garbageTimeout - sprite.totalDuration;
        if (time > difference && time < this.config.garbageTimeout) {
            this.renderSprite(SpriteIncomingAlert, vec2(0, 0), sprite.dimensions, time - difference);
        }
    }
}
