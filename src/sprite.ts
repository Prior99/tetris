import { external, inject } from "tsdi";
import { Atlas } from "./atlas";
import { vec2, Vec2 } from "./vec2";
import { ImageManager } from "./image-manager";

export class Sprite {
    @inject private images: ImageManager;

    constructor (public atlas: Atlas) {}

    public get image(): HTMLImageElement {
        return this.images.image(this.atlas.meta.image);
    }

    public render(position: Vec2, dimensions: Vec2, ctx: CanvasRenderingContext2D) {
        const [ frame ] = this.atlas.frames;
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

    public async load() {
        await this.images.load(this.atlas.meta.image);
    }

    public get dimensions() {
        const { sourceSize } = this.atlas.frames[0];
        return vec2(sourceSize.w, sourceSize.h);
    }
}
