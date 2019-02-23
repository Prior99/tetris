import { component, inject, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";
import {
    SpriteTetriminoI,
    SpriteTetriminoJ,
    SpriteTetriminoL,
    SpriteTetriminoO,
    SpriteTetriminoS,
    SpriteTetriminoT,
    SpriteTetriminoZ,
} from "./sprites";
import { Sprite } from "./sprite";
import { Constructable, SpriteManager } from "./sprite-manager";

function spriteForCellColor(cellColor: CellColor): Constructable<Sprite> | undefined {
    switch (cellColor) {
        case CellColor.TETRIMINO_I: return SpriteTetriminoI;
        case CellColor.TETRIMINO_J: return SpriteTetriminoJ;
        case CellColor.TETRIMINO_L: return SpriteTetriminoL;
        case CellColor.TETRIMINO_O: return SpriteTetriminoO;
        case CellColor.TETRIMINO_S: return SpriteTetriminoS;
        case CellColor.TETRIMINO_T: return SpriteTetriminoT;
        case CellColor.TETRIMINO_Z: return SpriteTetriminoZ;
    }
}

@component
export class Rendering {
    @inject private gameState: GameState;
    @inject private config: Config;
    @inject private sprites: SpriteManager;

    private canvas?: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    @initialize
    protected async initialize() {
        this.render();
    }

    public get pixelSize() {
        const rect = document.body.getBoundingClientRect();
        const naturalSize = vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));
        return adjustedSize;
    }

    private get cellPixelSize(): Vec2 {
        const size = this.pixelSize.x / this.config.visibleSize.x;
        return vec2(size, size);
    }

    public updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        const { ctx } = this;
        if (!ctx) { return; }
        switch (cellColor) {
            case CellColor.TETRIMINO_I:
            case CellColor.TETRIMINO_J:
            case CellColor.TETRIMINO_L:
            case CellColor.TETRIMINO_O:
            case CellColor.TETRIMINO_S:
            case CellColor.TETRIMINO_T:
            case CellColor.TETRIMINO_Z:
                const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
                this.sprites.sprite(spriteForCellColor(cellColor)!).render(position, this.cellPixelSize, ctx);
                break;
            case CellColor.GHOST:
                ctx.fillStyle = "grey";
                ctx.fillRect(pixelPosition.x, pixelPosition.y, this.cellPixelSize.x, -this.cellPixelSize.y);
                break;
        }
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
