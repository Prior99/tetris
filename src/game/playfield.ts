import { component, inject } from "tsdi";
import { Matrix } from "./matrix";
import { Config } from "config";
import { CellColor } from "./cell-color";
import { vec2 } from "utils";

@component
export class Playfield extends Matrix {
    constructor(@inject private config?: Config) {
        super(config!.logicalSize);
    }

    public reset() {
        this.update(new Matrix(this.config!.logicalSize));
    }

    public addGarbageLines(lines: number) {
        this.update(this.moveUp(lines));
        for (let line = 0; line < lines; ++line) {
            const hole = Math.floor(Math.random() * this.config!.logicalSize.x);
            for (let x  = 0; x < this.dimensions.x; ++x) {
                if (x !== hole) {
                    this.put(vec2(x, line), CellColor.GARBAGE);
                }
            }
        }
    }
}
