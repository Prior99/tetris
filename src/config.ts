import { component } from "tsdi";
import { vec2 } from "./vec2";

@component
export class Config {
    public logicalSize = vec2(10, 24);
    public visibleSize = vec2(10, 20);
    public tickSpeed = 1 / 60;
    public initialInputTimeout = 20 / 60;
    public inputRepeatTimeout = 2 / 60;
    public inputRotateRepeatTimeout = 10 / 60;

    public get visibleRatio() {
        return this.visibleSize.x / this.visibleSize.y;
    }
}
