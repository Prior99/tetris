import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";
import { Constructable, SpriteManager } from "./sprite-manager";
import { Graphics } from "./graphics";

@component
export class Lighting extends Graphics {
    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        this.ctx.fillStyle = "white";
        if (cellColor !== CellColor.EMPTY) {
            this.ctx.fillRect(pixelPosition.x, pixelPosition.y, this.cellPixelSize.x, -this.cellPixelSize.y);
        }
    }

    @bind public render() {
        this.renderClear();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
    }
}
