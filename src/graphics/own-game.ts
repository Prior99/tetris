import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { CellColor, GameState } from "game";
import { Lighting } from "./lighting";
import { Background } from "./background";
import { Graphics } from "./graphics";
import { spriteForCellColor } from "./sprite-for-cell-color";

@component
export class OwnGame extends Graphics {
    @inject private lighting: Lighting;
    @inject private background: Background;
    @inject private gameState: GameState;

    @initialize protected async initialize() {
        this.background.render();
        this.render();
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        const { ctx } = this;
        if (!ctx) { return; }
        if (cellColor !== CellColor.EMPTY) {
            const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
            this.renderSprite(spriteForCellColor(cellColor)!, position, this.cellPixelSize);
        }
    }

    public rescale(size: Vec2) {
        super.rescale(size);
        this.lighting.rescale(size);
        this.background.rescale(size);
        this.background.render();
    }

    private renderBackground() {
        this.background.render();
        this.ctx.globalCompositeOperation = "source-over";
        if (this.background.canvas) {
            this.ctx.drawImage(
                this.background.canvas,
                0,
                0,
                this.background.pixelSize.x,
                this.background.pixelSize.y,
                0,
                0,
                this.pixelSize.x,
                this.pixelSize.y,
            );
        }
    }

    private renderLighting() {
        this.lighting.render();
        this.ctx.globalCompositeOperation = "multiply";
        if (this.lighting.canvas) {
            this.ctx.drawImage(
                this.lighting.canvas,
                0,
                0,
                this.lighting.pixelSize.x,
                this.lighting.pixelSize.y,
                0,
                0,
                this.pixelSize.x,
                this.pixelSize.y,
            );
        }
    }

    private renderCells() {
        this.ctx.globalCompositeOperation = "source-over";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
    }

    @bind public render() {
        if (!this.ctx) { return; }
        this.renderBackground();
        this.renderCells();
        this.renderLighting();
    }
}
