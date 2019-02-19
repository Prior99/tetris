import { component } from "tsdi";
import { vec2 } from "./vec2";

@component
export class Config {
    public logicalSize = vec2(10, 20);
    public tickSpeed = 1 / 60;
    public inputSpeed = 0.04298;

    public get ratio() {
        return this.logicalSize.x / this.logicalSize.y;
    }
}
