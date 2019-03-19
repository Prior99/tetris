import * as React from "react";
import * as RandomSeed from "random-seed";
import { observer } from "mobx-react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { vec2, Vec2, Matrix } from "utils";
import {
    TetriminoMatrixI,
    TetriminoMatrixJ,
    TetriminoMatrixL,
    TetriminoMatrixO,
    TetriminoMatrixS,
    TetriminoMatrixZ,
    TetriminoMatrixT,
} from "game/tetriminos";
import { spriteForCellColor } from "graphics";
import { CellColor } from "types";
import { SpriteManager } from "resources";
import * as css from "./background.scss";

@external @observer
export class Background extends React.Component {
    @inject private sprites: SpriteManager;
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private dimensions = vec2(0, 0);
    private rand = RandomSeed.create();

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
        if (!this.canvas || !this.ctx || !this.dimensions) {
            setTimeout(this.renderCanvas, 100);
            return;
        }
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.rand.floatBetween(0, 1) > 0.5) { this.renderNewTetrimino(); }
        setTimeout(this.renderCanvas, 100);
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.rescale();
    }

    private randomTetrimino(): Matrix {
        const tetriminos = [
            TetriminoMatrixI,
            TetriminoMatrixJ,
            TetriminoMatrixL,
            TetriminoMatrixO,
            TetriminoMatrixS,
            TetriminoMatrixZ,
            TetriminoMatrixT,
        ];
        const clazz = tetriminos[this.rand.range(tetriminos.length)];
        let tetrimino = new clazz();
        const rotation = this.rand.range(4);
        for (let i = 0; i < rotation; ++i) { tetrimino = tetrimino.rotateLeft(); }
        return tetrimino;
    }

    private randomPosition(): Vec2 {
        return vec2(this.rand.range(this.dimensions.x), this.rand.range(this.dimensions.y));
    }

    private renderNewTetrimino() {
        const tetrimino = this.randomTetrimino();
        const position = this.randomPosition();
        for (let x = 0; x < tetrimino.dimensions.x; ++x) {
            for (let y = 0; y < tetrimino.dimensions.y; ++y) {
                const offset = vec2(x, y);
                const color = tetrimino.at(offset);
                if (color === CellColor.EMPTY) { continue; }
                const pixelPosition = position
                    .add(offset)
                    .mult(this.config.tetriminoPixelSize)
                    .add(vec2(this.config.tetriminoPixelSize, this.config.tetriminoPixelSize).div(-2));
                const spriteClass = spriteForCellColor(color);
                if (!spriteClass) {  continue; }
                const sprite = this.sprites.sprite(spriteClass);
                sprite.render(pixelPosition, sprite.dimensions, this.ctx!, 0);
            }
        }

    }

    public render() {
        this.renderCanvas();
        return (
            <canvas ref={this.canvasRef} className={css.background} />
        );
    }
}
