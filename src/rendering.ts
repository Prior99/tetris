import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";
import { SpriteTetrimino } from "./sprites";
import { SpriteManager } from "./sprite-manager";

@component
export class Rendering {
    @inject private gameState: GameState;
    @inject private config: Config;
    @inject private sprites: SpriteManager;

    private canvas?: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    @initialize
    protected initialize() {
        this.render();
    }

    private get pixelSize() {
        if (!this.canvas) { return vec2(0, 0); }
        return vec2(this.canvas.width, this.canvas.height);
    }

    private get cellPixelSize() {
        return this.pixelSize.x / this.config.visibleSize.x;
    }

    public updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        const { ctx } = this;
        if (!ctx) { return; }
        switch (cellColor) {
            case CellColor.EMPTY:
                ctx.fillStyle = "white";
                break;
            case CellColor.TETRIMINO_I:
                ctx.fillStyle = "lightblue";
                break;
            case CellColor.TETRIMINO_J:
                ctx.fillStyle = "lime";
                break;
            case CellColor.TETRIMINO_L:
                ctx.fillStyle = "blue";
                break;
            case CellColor.TETRIMINO_O:
                ctx.fillStyle = "yellow";
                break;
            case CellColor.TETRIMINO_S:
                ctx.fillStyle = "green";
                break;
            case CellColor.TETRIMINO_T:
                ctx.fillStyle = "purple";
                break;
            case CellColor.TETRIMINO_Z:
                ctx.fillStyle = "red";
                break;
            case CellColor.GHOST:
                ctx.fillStyle = "grey";
                break;
        }
        ctx.fillRect(pixelPosition.x, pixelPosition.y, this.cellPixelSize, -this.cellPixelSize);
    }

    private renderClear() {
        if (!this.ctx) { return; }
        this.ctx.clearRect(0, 0, this.pixelSize.x, this.pixelSize.y);
    }

    private translate(pos: Vec2): Vec2 {
        return vec2(pos.x, this.config.visibleSize.y - pos.y).mult(this.cellPixelSize);
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
        const pos = this.translate(this.gameState.currentTetrimino.offset);
        const dimensions = this.gameState.currentTetrimino.matrix.dimensions.mult(this.cellPixelSize);
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

    @bind private render() {
        this.renderClear();
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
        if (this.gameState.debug) {
            this.renderDebug();
        }
        window.requestAnimationFrame(this.render);
    }
}
