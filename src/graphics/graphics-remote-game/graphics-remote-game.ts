import { bind } from "lodash-decorators";
import { external } from "tsdi";
import { vec2, Vec2, Matrix } from "utils";
import { CellColor } from "types";
import { SpriteTetriminoOther, SpriteTetriminoGhost } from "resources";
import { Graphics } from "../graphics";
import { spriteForCellColor } from "../sprite-for-cell-color";

@external
export class GraphicsRemoteGame extends Graphics {
    constructor(private matrix: Matrix) {
        super();
        this.render();
    }

    private lastRenderedMatrix?: Matrix;

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
                this.renderSprite(spriteForCellColor(cellColor)!, position, this.cellPixelSize);
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
