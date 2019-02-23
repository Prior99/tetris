import { external } from "tsdi";
import { Sprite } from "./sprite";
import { Vec2 } from "utils";
import * as RandomSeed from "random-seed";

@external
export class SpriteFloor extends Sprite {
    public render(position: Vec2, dimensions: Vec2, ctx: CanvasRenderingContext2D) {
        const rand = RandomSeed.create();
        rand.seed(`${position.x + position.y * dimensions.y}`);
        const frame = this.atlas.frames[rand.range(this.atlas.frames.length)];
        ctx.drawImage(
            this.image,
            frame.frame.x,
            frame.frame.y,
            frame.frame.w,
            frame.frame.h,
            position.x,
            position.y,
            dimensions.x,
            dimensions.y,
        );
    }
}
