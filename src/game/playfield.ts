import { component, inject } from "tsdi";
import { Matrix } from "./matrix";
import { Config } from "config";

@component
export class Playfield extends Matrix {
    constructor(@inject private config?: Config) {
        super(config!.logicalSize);
    }

    public reset() {
        this.update(new Matrix(this.config!.logicalSize));
    }
}
