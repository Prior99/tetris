import * as React from "react";
import { observer } from "mobx-react";
import { inject, external } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { spriteForCellColor } from "graphics";
import * as css from "./tetrimino-preview.scss";
import { vec2, Vec2 } from "utils";
import { CellColor, Matrix } from "game";
import { SpriteManager } from "resources";

@external @observer
export class TetriminoPreview extends React.Component<{ matrix: Matrix, size?: number }> {
   @inject private sprites: SpriteManager;
   @inject private config: Config;

   private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;

    constructor(props: { matrix: Matrix }) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    public componentWillUnmount() {
        window.removeEventListener("rescale", this.rescale);
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const dimensions = this.props.matrix.dimensions.mult(this.config.tetriminoPixelSize);
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        const factor = this.props.size ? this.props.size : 0.5;
        canvas.style.width = `${dimensions.x * factor}px`;
        canvas.style.height = `${dimensions.y * factor}px`;
    }

    private translate(pos: Vec2): Vec2 {
        return vec2(pos.x, this.props.matrix.dimensions.y - pos.y).mult(this.cellPixelSize);
    }

    private get cellPixelSize(): Vec2 {
        return this.dimensions.div(this.props.matrix.dimensions);
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

   private renderCanvas() {
        this.rescale();
        if (!this.ctx) { return; }
        const { matrix } = this.props;
        this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
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

    public render() {
        this.renderCanvas();
        return (
            <div className={css.tetriminoPreview}>
                <canvas ref={this.canvasRef} className={css.tetriminoPreviewCanvas} />
            </div>
        );
    }
}
