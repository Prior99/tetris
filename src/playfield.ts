import { component, inject } from "tsdi";
import { Matrix } from "./matrix";
import { Config } from "./config";

@component
export class Playfield extends Matrix {
    constructor(@inject config?: Config) {
        super(config!.logicalSize);
    }
}
