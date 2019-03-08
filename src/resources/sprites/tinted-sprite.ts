import { external } from "tsdi";
import { Atlas } from "types";
import { Sprite } from "./sprite";
import { createCanvas } from "utils";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class TintedSprite extends Sprite {
    private tintedImage: HTMLCanvasElement;

    constructor(atlas: Atlas, private tintedColor: string) { super(atlasTetriminoLight); }

    public get image(): CanvasImageSource {
        return this.tintedImage;
    }

    public async load() {
        await this.images.load(this.atlas.meta.image);
        const image = this.images.image(this.atlas.meta.image);
        this.tintedImage = createCanvas();
        this.tintedImage.width = image.width;
        this.tintedImage.height = image.height;
        const ctx = this.tintedImage.getContext("2d")!;
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = this.tintedColor;
        ctx.fillRect(0, 0, image.width, image.height);
        ctx.drawImage(image, 0, 0);
    }
}
