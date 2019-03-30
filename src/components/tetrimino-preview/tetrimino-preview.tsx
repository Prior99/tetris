import * as React from "react";
import { observer } from "mobx-react";
import { inject, external } from "tsdi";
import { bind } from "lodash-decorators";
import { spriteForCellColor } from "graphics";
import { vec2, Vec2, Matrix } from "utils";
import { CellColor } from "types";
import { SpriteManager } from "resources";
import * as css from "./tetrimino-preview.scss";

@external @observer
export class TetriminoPreview extends React.Component<{ matrix: Matrix, size?: number }> {
    @inject private sprites: SpriteManager;

    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private div?: HTMLDivElement;

    constructor(props: { matrix: Matrix }) {
        super(props);
        window.addEventListener("resize", this.renderCanvas);
    }

    public componentWillUnmount() {
        window.removeEventListener("rescale", this.renderCanvas);
    }

    private translate(pos: Vec2): Vec2 {
        return vec2(pos.x, this.props.matrix.dimensions.y - pos.y).mult(this.cellPixelSize);
    }

    private get cellPixelSize(): Vec2 {
        const cellSize = document.body.getBoundingClientRect().height > 1280 ? 48 : 24;
        return vec2(cellSize, cellSize);
    }

    private get dimensions(): Vec2 {
        if (!this.canvas) { return vec2(0, 0); }
        return vec2(this.canvas.width, this.canvas.height);
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        if (cellColor === CellColor.EMPTY) { return; }
        const { ctx } = this;
        if (!ctx) { return; }
        const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
        this.sprites.sprite(spriteForCellColor(cellColor)!).render(position, this.cellPixelSize, ctx, 0);
    }

    @bind private renderCanvas() {
        const { canvas, div, ctx } = this;
        if (!canvas || !div || !ctx) { return; }
        const size = this.props.matrix.dimensions.mult(this.cellPixelSize);
        canvas.style.width = `${size.x}px`;
        canvas.style.height = `${size.y}px`;
        canvas.width = size.x;
        canvas.height = size.y;
        const { matrix } = this.props;
        ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
        for (let y = 0; y < matrix.dimensions.y; ++y) {
            for (let x = 0; x < matrix.dimensions.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), matrix.at(pos));
            }
        }
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.renderCanvas();
    }

    @bind private divRef(div: HTMLDivElement) {
        this.div = div;
        this.renderCanvas();
    }

    public render() {
        this.renderCanvas();
        return (
            <div className={css.tetriminoPreview} ref={this.divRef}>
                <canvas ref={this.canvasRef} className={css.tetriminoPreviewCanvas} />
            </div>
        );
    }
}
