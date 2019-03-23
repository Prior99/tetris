import { bind } from "lodash-decorators";
import { external } from "tsdi";
import { vec2, Vec2 } from "utils";
import { Game } from "game";
import { CellColor } from "types";
import { GraphicsLighting } from "./graphics-lighting";
import { GraphicsBackground } from "./graphics-background";
import { Graphics } from "../graphics";
import { spriteForCellColor } from "../sprite-for-cell-color";
import { GraphicsOverlay } from "./graphics-overlay";

@external
export class GraphicsGame extends Graphics {
    private background = new GraphicsBackground(this.game);
    private overlay = new GraphicsOverlay(this.game);
    private lighting = new GraphicsLighting(this.game);

    constructor (protected game: Game) {
        super();
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
        this.overlay.rescale(size);
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
        this.ctx.globalAlpha = 0.3;
        this.ctx.globalCompositeOperation = "lighter";
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

    private renderOverlay() {
        this.overlay.render();
        this.ctx.globalAlpha = 0.7;
        this.ctx.globalCompositeOperation = "lighter";
        if (this.overlay.canvas) {
            this.ctx.drawImage(
                this.overlay.canvas,
                0,
                0,
                this.overlay.pixelSize.x,
                this.overlay.pixelSize.y,
                0,
                0,
                this.pixelSize.x,
                this.pixelSize.y,
            );
        }
    }

    private renderCells() {
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = "source-over";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.game.temporaryState.at(pos));
            }
        }
    }

    @bind public render() {
        if (!this.ctx) { return; }
        this.renderBackground();
        this.renderCells();
        this.renderLighting();
        this.renderOverlay();
    }
}
