import { external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2, Vec2 } from "utils";
import { CellColor, Matrix } from "game";
import {
    SpriteTetriminoOther,
} from "sprites";
import { Graphics } from "./graphics";

@external
export class OtherGame extends Graphics {
    constructor(private matrix: Matrix) { super(); }

    @initialize protected async initialize() {
        this.render();
    }

    private renderCell(pixelPosition: Vec2, cellColor: CellColor) {
        const { ctx } = this;
        if (!ctx) { return; }
        if (cellColor !== CellColor.EMPTY) {
            const position = pixelPosition.sub(vec2(0, this.cellPixelSize.y));
            this.renderSprite(SpriteTetriminoOther, position, this.cellPixelSize);
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
        this.renderClear();
        this.renderCells();
    }
}
