import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { EffectInfo, Effects, EffectType, CellColor, GameState, EffectLineCleared } from "game";
import { Graphics } from "./graphics";
import { lightSpriteForCellColor } from "./sprite-for-cell-color";
import { SpriteEffectLineCleared } from "sprites";
import { differenceInMilliseconds } from "date-fns";

@component
export class Lighting extends Graphics {
    @inject private gameState: GameState;
    @inject private effects: Effects;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderCell(position: Vec2, cellColor: CellColor) {
        if (cellColor === CellColor.EMPTY || cellColor === CellColor.GARBAGE) {
            return;
        }
        const spriteClass = lightSpriteForCellColor(cellColor)!;
        const sprite = this.sprites.sprite(spriteClass);
        const margin = vec2(
            (sprite.dimensions.x - this.config.tetriminoPixelSize) / 2,
            (sprite.dimensions.y - this.config.tetriminoPixelSize) / 2,
        ).mult(this.scaleFactor);
        const pixelPosition = this.translate(position).sub(vec2(0, this.cellPixelSize.y));
        const { totalDuration } = sprite;
        const distance = this.gameState.lastHitPosition
            ? this.gameState.lastHitPosition.distance(position)
            : Number.POSITIVE_INFINITY;
        const time = this.gameState.timeSinceLastHit < totalDuration
            ? Math.min(totalDuration - 0.2, this.gameState.timeSinceLastHit * 3 + distance / 2)
            : totalDuration - 0.15;
        this.renderSprite(spriteClass, pixelPosition.sub(margin), sprite.dimensions.mult(this.scaleFactor), time);
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalCompositeOperation = "lighten";
        this.ctx.fillStyle = "rgb(25, 25, 25)";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(pos, this.gameState.temporaryState.at(pos));
            }
        }
        this.renderLineClearEffects();
    }

    private renderLineClearEffects() {
        this.effects.effects.forEach(effect => {
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
