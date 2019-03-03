import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { Game } from "game";
import { EffectLineCleared, EffectInfo, EffectType, CellColor } from "types";
import { Graphics } from "./graphics";
import { lightSpriteForCellColor } from "./sprite-for-cell-color";
import { SpriteEffectLineCleared, Sprite } from "resources";
import { differenceInMilliseconds } from "date-fns";

@component
export class Lighting extends Graphics {
    @inject private game: Game;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderCell(position: Vec2, cellColor: CellColor) {
        if (cellColor === CellColor.EMPTY) { return; }
        const spriteClass = lightSpriteForCellColor(cellColor)!;
        const sprite = this.sprites.sprite(spriteClass);
        const margin = vec2(
            (sprite.dimensions.x - this.config.tetriminoPixelSize) / 2,
            (sprite.dimensions.y - this.config.tetriminoPixelSize) / 2,
        ).mult(this.scaleFactor);
        const pixelPosition = this.translate(position).sub(vec2(0, this.cellPixelSize.y));
        const time = this.getTetriminoBloomAnimationTime(position, sprite);
        this.renderSprite(spriteClass, pixelPosition.sub(margin), sprite.dimensions.mult(this.scaleFactor), time);
    }

    private getTetriminoBloomAnimationTime(position: Vec2, sprite: Sprite) {
        const {timeSinceLastHit } = this.game;
        if (!timeSinceLastHit || timeSinceLastHit > sprite.totalDuration) {
            return sprite.totalDuration - 0.15;
        }
        const distance = this.game.lastHitPosition
            ? this.game.lastHitPosition.distance(position)
            : Number.POSITIVE_INFINITY;
        return Math.min(sprite.totalDuration - 0.2, timeSinceLastHit * 3 + distance / 2);
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalCompositeOperation = "lighten";
        this.ctx.fillStyle = "rgb(70, 70, 70)";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(pos, this.game.temporaryState.at(pos));
            }
        }
        this.renderLineClearEffects();
    }

    private renderLineClearEffects() {
        this.game.effects.forEach(effect => {
            if (effect.effect.effect === EffectType.LINE_CLEARED) {
                this.renderLineClearEffect(effect);
            }
        });
    }

    private renderLineClearEffect(effect: EffectInfo<EffectLineCleared>) {
        const sprite = this.sprites.sprite(SpriteEffectLineCleared);
        const time = differenceInMilliseconds(new Date(), effect.date) / 1000;
        if (time > sprite.totalDuration) {
            effect.consume();
            return;
        }
        for (let x = 0; x < this.config.logicalSize.x; ++x) {
            const position = this.translate(vec2(x, effect.effect.y + 5));
            this.renderSprite(SpriteEffectLineCleared, position, sprite.dimensions.mult(this.scaleFactor), time);
        }
    }
}
