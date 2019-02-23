import { external, inject } from "tsdi";
import { Atlas, Frame } from "./atlas";
import { vec2, Vec2 } from "./vec2";
import { ImageManager } from "./image-manager";

export class Sprite {
    @inject private images: ImageManager;

    constructor (public atlas: Atlas) {}

    public get image(): HTMLImageElement {
        return this.images.image(this.atlas.meta.image);
    }

    public get totalDuration(): number {
        return this.atlas.frames.map(frame => frame.duration).reduce((sum: number, duration) => sum + duration) / 1000;
    }

    public offsetInAnimation(time: number): number {
        return time % this.totalDuration;
    }

    public frame(time: number): Frame | undefined {
        let offset = this.offsetInAnimation(time);
        let index = 0;
        let frame: Frame | undefined = undefined;
        while (offset > 0) {
            frame = this.atlas.frames[index];
            offset -= frame.duration / 1000;
            index++;
        }
        return frame;
    }

    public render(position: Vec2, dimensions: Vec2, ctx: CanvasRenderingContext2D, time: number) {
        const frame = this.frame(time);
        if (!frame) { return; }
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
