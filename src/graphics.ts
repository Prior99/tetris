import { component, inject, initialize } from "tsdi";
import { GameState } from "./game-state";
import { Config } from "./config";
import { vec2, Vec2 } from "./vec2";
import { Constructable, SpriteManager } from "./sprite-manager";

@component
export abstract class Graphics {
    @inject protected gameState: GameState;
    @inject protected config: Config;
    @inject protected sprites: SpriteManager;

    public canvas?: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public pixelSize = vec2(0, 0);

    public updateCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.imageSmoothingEnabled = false;
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
}
