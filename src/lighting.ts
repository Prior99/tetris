import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";
import { Constructable, SpriteManager } from "./sprite-manager";
import { Graphics } from "./graphics";
import { SpriteTetriminoLight } from "./sprites";

@component
export class Lighting extends Graphics {
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
            this.lightSprite.render(position.sub(margin), this.lightSprite.dimensions.mult(this.scaleFactor), this.ctx);
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
