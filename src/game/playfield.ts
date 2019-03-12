import { external, inject } from "tsdi";
import * as Random from "random-seed";
import { Config } from "config";
import { CellColor } from "types";
import { vec2, Matrix  } from "utils";

@external
export class Playfield extends Matrix {
    constructor(private random: Random.RandomSeed, @inject private config?: Config) {
        super(config!.logicalSize);
    }

    public addGarbageLines(lines: number) {
        this.update(this.moveUp(lines));
        for (let line = 0; line < lines; ++line) {
            const hole = this.random.range(this.config!.logicalSize.x);
            for (let x  = 0; x < this.dimensions.x; ++x) {
                if (x !== hole) {
                    this.put(vec2(x, line), CellColor.GARBAGE);
                }
            }
        }
    }

    public clear() {
        this.update(new Matrix(this.dimensions));
    }
}
