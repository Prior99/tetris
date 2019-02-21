import { Atlas } from "./atlas";
import { Vec2 } from "./vec2";

export class Sprite {
    constructor (public atlas: Atlas) {}

    public render(position: Vec2, dimensions: Vec2, ctx: CanvasRenderingContext2D) { return; }
}
