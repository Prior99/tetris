import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { CellColor, GameState } from "game";
import {
    Sprite,
    SpriteTetriminoI,
    SpriteTetriminoJ,
    SpriteTetriminoL,
    SpriteTetriminoO,
    SpriteTetriminoS,
    SpriteTetriminoT,
    SpriteTetriminoZ,
    SpriteTetriminoGhost,
} from "sprites";
import { Lighting } from "./lighting";
import { Background } from "./background";
import { Graphics } from "./graphics";
import { Constructable } from "types";

function spriteForCellColor(cellColor: CellColor): Constructable<Sprite> | undefined {
    switch (cellColor) {
        case CellColor.TETRIMINO_I: return SpriteTetriminoI;
        case CellColor.TETRIMINO_J: return SpriteTetriminoJ;
        case CellColor.TETRIMINO_L: return SpriteTetriminoL;
        case CellColor.TETRIMINO_O: return SpriteTetriminoO;
        case CellColor.TETRIMINO_S: return SpriteTetriminoS;
        case CellColor.TETRIMINO_T: return SpriteTetriminoT;
        case CellColor.TETRIMINO_Z: return SpriteTetriminoZ;
        case CellColor.GHOST: return SpriteTetriminoGhost;
    }
}

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

    private renderDebug() {
        if (!this.ctx) { return; }
        // Render grid.
        this.ctx.strokeStyle = "grey";
        this.ctx.fillStyle = "grey";
        this.ctx.font = "12px Arial";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            const origin = this.translate(vec2(0, y));
            const destination = this.translate(vec2(this.config.visibleSize.x, y));
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(destination.x, destination.y);
            this.ctx.stroke();
            this.ctx.fillText(`${y}`, origin.x, origin.y);
        }
        for (let x = 0; x < this.config.visibleSize.x; ++x) {
            const origin = this.translate(vec2(x, 0));
            const destination = this.translate(vec2(x, this.config.visibleSize.y));
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(destination.x, destination.y);
            this.ctx.stroke();
            this.ctx.fillText(`${x}`, origin.x, origin.y);
        }

        // Render Tetrimino.
        const pos = this.translate(this.gameState.current.tetrimino.offset);
        const dimensions = this.gameState.current.tetrimino.matrix.dimensions.mult(this.cellPixelSize);
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(pos.x, pos.y, dimensions.x, -dimensions.y);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x - 10, pos.y - 10);
        this.ctx.lineTo(pos.x + 10, pos.y + 10);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x + 10, pos.y - 10);
        this.ctx.lineTo(pos.x - 10, pos.y + 10);
        this.ctx.stroke();
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
        if (this.gameState.debug) { this.renderDebug(); }
    }
}
