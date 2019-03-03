import { external, inject } from "tsdi";
import { Config } from "config";
import { CellColor } from "types";
import { vec2, Matrix  } from "utils";

@external
export class Playfield extends Matrix {
    constructor(@inject private config?: Config) {
        super(config!.logicalSize);
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
