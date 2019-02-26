import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { CellColor, GameState } from "game";
import { Graphics } from "./graphics";
import { lightSpriteForCellColor } from "./sprite-for-cell-color";

@component
export class Lighting extends Graphics {
    @inject private gameState: GameState;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderCell(position: Vec2, cellColor: CellColor) {
        if (cellColor === CellColor.EMPTY) {
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
            ? Math.min(totalDuration - 0.2, this.gameState.timeSinceLastHit + distance / 5)
            : totalDuration - 0.2;
        this.renderSprite(spriteClass, pixelPosition.sub(margin), sprite.dimensions.mult(this.scaleFactor), time);
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalCompositeOperation = "lighten";
        this.ctx.fillStyle = "rgb(100, 100, 100)";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(pos, this.gameState.temporaryState.at(pos));
            }
        }
    }
}
