import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { CellColor, GameState } from "game";
import { Graphics } from "./graphics";
import { SpriteTetriminoLight } from "sprites";

@component
export class Lighting extends Graphics {
    @inject private gameState: GameState;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    protected get lightSprite() {
        return this.sprites.sprite(SpriteTetriminoLight);
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        this.ctx.fillStyle = "white";
        const margin = vec2(
            (this.lightSprite.dimensions.x - this.config.tetriminoPixelSize) / 2,
            (this.lightSprite.dimensions.y - this.config.tetriminoPixelSize) / 2,
        ).mult(this.scaleFactor);
        if (cellColor !== CellColor.EMPTY) {
            const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
            const { totalDuration } = this.sprites.sprite(SpriteTetriminoLight);
            const time = this.gameState.timeSinceLastHit < totalDuration
                ? this.gameState.timeSinceLastHit
                : totalDuration - 0.001;
            this.renderSprite(
                SpriteTetriminoLight,
                position.sub(margin),
                this.lightSprite.dimensions.mult(this.scaleFactor),
                time,
            );
        }
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalCompositeOperation = "lighten";
        this.ctx.fillStyle = "rgb(60, 60, 60)";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
    }
}
