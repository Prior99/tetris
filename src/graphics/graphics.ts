import { inject } from "tsdi";
import { Config } from "config";
import { vec2, Vec2 } from "utils";
import { Constructable } from "types";
import { SpriteManager, Sprite } from "resources";
import { differenceInMilliseconds } from "date-fns";

export abstract class Graphics {
    @inject protected config: Config;
    @inject protected sprites: SpriteManager;

    public canvas?: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public pixelSize = vec2(0, 0);

    private timeStarted?: Date;

    constructor() {
        this.timeStarted = new Date();
    }

    public updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
    }

    public get seconds() {
        if (!this.timeStarted) { return 0; }
        return differenceInMilliseconds(new Date(), this.timeStarted) / 100;
    }

    protected get cellPixelSize(): Vec2 {
        const size = this.pixelSize.x / this.config.visibleSize.x;
        return vec2(size, size);
    }

    protected renderClear() {
        if (!this.ctx) { return; }
        this.ctx.clearRect(0, 0, this.pixelSize.x, this.pixelSize.y);
    }

    protected translate(pos: Vec2): Vec2 {
        return vec2(pos.x, this.config.visibleSize.y - pos.y).mult(this.cellPixelSize);
    }

    public abstract render(): void;

    public rescale(size: Vec2) {
        if (!this.canvas) { return; }
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.pixelSize = size;
    }

    public get scaleFactor() {
        return this.cellPixelSize.div(this.config.tetriminoPixelSize);
    }

    public renderSprite(sprite: Constructable<Sprite>, position: Vec2, dimensions: Vec2, time?: number) {
        this.sprites.sprite(sprite).render(
            position,
            dimensions,
            this.ctx,
            typeof time === "number" ? time : this.seconds,
        );
    }
}
