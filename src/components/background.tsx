import * as React from "react";
import * as RandomSeed from "random-seed";
import { observer } from "mobx-react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { vec2, Vec2, Matrix } from "utils";
import { spriteForCellColor } from "graphics";
import { CellColor } from "types";
import { SpriteManager } from "resources";
import * as css from "./background.scss";

interface FlyingTetrimino {
    color: CellColor;
    pos: Vec2;
    trajectory: Vec2;
}

@external @observer
export class Background extends React.Component {
    @inject private sprites: SpriteManager;
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private dimensions = vec2(0, 0);
    private rand = RandomSeed.create();
    private flyingTetriminos = new Map<number, FlyingTetrimino>();

    constructor(props: { matrix: Matrix }) {
        super(props);
        window.addEventListener("resize", this.rescale);
        this.rand.seed("background");
    }

    @initialize protected initialize() {
        this.renderCanvas();
    }

    public componentWillUnmount() {
        window.removeEventListener("rescale", this.rescale);
    }

    @bind private rescale() {
        const { canvas, ctx } = this;
        if (!canvas || !ctx) { return; }
        const realSize = canvas.getBoundingClientRect();
        canvas.width = realSize.width;
        canvas.height = realSize.height;
        this.dimensions = vec2(
            Math.ceil(canvas.width / this.config.tetriminoPixelSize),
            Math.ceil(canvas.width / this.config.tetriminoPixelSize),
        );
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    @bind private renderCanvas() {
        if (!this.canvas || !this.ctx) {
            setTimeout(this.renderCanvas, 100);
            return;
        }
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.clearRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        this.flyingTetriminos.forEach(this.renderTetrimino);
        this.flyingTetriminos.forEach(this.tickTetrimino);
        this.cleanUp();
        window.requestAnimationFrame(this.renderCanvas);
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.rescale();
        while (this.flyingTetriminos.size < this.dimensions.x / 10) {
            this.createTetrimino();
        }
    }

    private randomTetrimino(column: number): FlyingTetrimino {
        const colors = [
            CellColor.TETRIMINO_I,
            CellColor.TETRIMINO_J,
            CellColor.TETRIMINO_L,
            CellColor.TETRIMINO_O,
            CellColor.TETRIMINO_S,
            CellColor.TETRIMINO_Z,
            CellColor.TETRIMINO_T,
        ];
        const color = colors[this.rand.range(colors.length)];
        const pos = vec2(column * this.config.tetriminoPixelSize, -this.config.tetriminoPixelSize);
        return { pos, trajectory: this.randomTrajectory(), color };
    }

    private randomTrajectory() {
        return vec2(0, this.rand.floatBetween(0.3, 0.8));
    }

    private randomColumn(): number {
        const freeColumns: number[] = [];
        for (let column = 0; column < this.dimensions.x; ++column) {
            if (!this.flyingTetriminos.has(column)) { freeColumns.push(column); }
        }
        return freeColumns[this.rand.range(freeColumns.length)];
    }

    private get pixelSize() {
        if (!this.canvas) { throw new Error("Can't determine pixel size of uninitialized background component."); }
        return vec2(this.canvas.width, this.canvas.height);
    }

    private createTetrimino() {
        const column = this.randomColumn();
        const flyingTetrimino = this.randomTetrimino(column);
        this.flyingTetriminos.set(column, flyingTetrimino);
    }

    @bind private renderTetrimino({ color, pos, trajectory }: FlyingTetrimino) {
        const spriteClass = spriteForCellColor(color);
        if (!spriteClass) { return; }
        const sprite = this.sprites.sprite(spriteClass);
        sprite.render(pos, sprite.dimensions, this.ctx!, 0);
    }

    @bind private tickTetrimino(tetrimino: FlyingTetrimino) {
        tetrimino.pos = tetrimino.pos.add(tetrimino.trajectory);
    }

    private cleanUp() {
        for (let [column, { pos }] of this.flyingTetriminos.entries()) {
            if (pos.y > this.pixelSize.y || pos.x > this.pixelSize.x) {
                this.flyingTetriminos.delete(column);
            }
        }
        if (this.flyingTetriminos.size < this.dimensions.x && this.rand.range(100) < 5) {
            this.createTetrimino();
        }
    }

    public render() {
        this.renderCanvas();
        return (
            <canvas ref={this.canvasRef} className={css.background} />
        );
    }
}
