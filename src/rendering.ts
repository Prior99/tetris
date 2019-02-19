import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";

@component
export class Rendering {
    @inject private gameState: GameState;
    @inject private config: Config;

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
        return this.pixelSize.x / this.config.logicalSize.x;
    }

    public updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        const { ctx, pixelSize } = this;
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
        }
        ctx.fillRect(pixelPosition.x, pixelPosition.y, this.cellPixelSize, this.cellPixelSize);
    }

    private renderClear() {
        if (!this.ctx) { return; }
        this.ctx.clearRect(0, 0, this.pixelSize.x, this.pixelSize.y);
    }

    @bind private render() {
        this.renderClear();
        for (let y = 0; y < this.config.logicalSize.y; ++y) {
            for (let x = 0; x < this.config.logicalSize.x; ++x) {
                const pos = vec2(x, y);
                const invertedPos = vec2(pos.x, this.config.logicalSize.y - pos.y);
                this.renderCell(invertedPos.mult(this.cellPixelSize), this.gameState.temporaryState.at(pos));
            }
        }
        window.requestAnimationFrame(this.render);
    }
}
