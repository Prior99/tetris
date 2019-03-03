import { external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2, Matrix } from "utils";
import { CellColor } from "types";
import { SpriteTetriminoOther, SpriteTetriminoGhost } from "resources";
import { Graphics } from "./graphics";

@external
export class OtherGame extends Graphics {
    constructor(private matrix: Matrix) { super(); }

    private lastRenderedMatrix?: Matrix;

    @initialize protected async initialize() {
        this.render();
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        if (!this.ctx) { return; }
        const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
        switch (cellColor) {
            case CellColor.EMPTY: { break; }
            case CellColor.GHOST: {
                this.renderSprite(SpriteTetriminoGhost, position, this.cellPixelSize);
                break;
            }
            default: {
                this.renderSprite(SpriteTetriminoOther, position, this.cellPixelSize);
                break;
            }
        }
    }

    private renderCells() {
        this.ctx.globalCompositeOperation = "source-over";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = vec2(x, y);
                this.renderCell(this.translate(pos), this.matrix.at(pos));
            }
        }
    }

    @bind public render() {
        if (!this.ctx) { return; }
        if (this.lastRenderedMatrix && this.lastRenderedMatrix.equals(this.matrix)) { return; }
        this.lastRenderedMatrix = new Matrix(this.matrix);
        this.renderClear();
        this.renderCells();
    }
}
