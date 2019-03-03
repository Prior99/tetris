import { equals } from "ramda";
import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Game } from "game";
import { vec2, Vec2 } from "utils";
import {
    SpriteFloorLove,
    SpriteFloorBricks,
    SpriteFloorWhiteTiles,
    SpriteFloorWood,
    SpriteFloorTetris,
    SpriteFloorStars,
} from "resources";
import { Graphics } from "./graphics";

@component
export class Background extends Graphics {
    @inject private game: Game;

    private lastLevelRendered?: number;
    private lastResizeRendered?: Vec2;
    private lastCanvasSizeRendered?: [number, number];
    private lastSerialRendered?: string;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    protected get spriteClass() {
        const { level } = this.game;
        if (level < 1) { return SpriteFloorBricks; }
        if (level < 2) { return SpriteFloorTetris; }
        if (level < 4) { return SpriteFloorStars; }
        if (level < 6) { return SpriteFloorLove; }
        if (level < 8) { return SpriteFloorWood; }
        return SpriteFloorWhiteTiles;
    }

    protected get sprite() {
        return this.sprites.sprite(this.spriteClass);
    }

    protected get canvasSize(): [number, number] {
        if (!this.canvas) { return [0, 0]; }
        return [this.canvas.width, this.canvas.height];
    }

    public rescale(size: Vec2) {
        super.rescale(size);
        this.lastCanvasSizeRendered = undefined;
    }

    private get shouldRender() {
        const levelChanged = this.lastLevelRendered === undefined || this.lastLevelRendered !== this.game.level;
        const sizeChanged = this.lastResizeRendered === undefined || !this.lastResizeRendered.equals(this.pixelSize);
        const serialChanged = this.lastSerialRendered === undefined || this.lastSerialRendered !== this.game.serial;
        const canvasSizeChanged = this.lastCanvasSizeRendered === undefined ||
            !equals(this.lastCanvasSizeRendered, this.canvasSize);
        return levelChanged || sizeChanged || serialChanged || canvasSizeChanged;
    }

    @bind public render() {
        if (!this.shouldRender) { return; }
        const { dimensions } = this.sprite;
        const renderSize = dimensions.mult(this.scaleFactor);
        for (let y = 0; y < this.pixelSize.y; y += renderSize.y) {
            for (let x = 0; x < this.pixelSize.x; x += renderSize.x) {
                this.renderSprite(this.spriteClass, vec2(x, y), renderSize);
            }
        }
        this.lastLevelRendered = this.game.level;
        this.lastResizeRendered = this.pixelSize;
        this.lastSerialRendered = this.game.serial;
        this.lastCanvasSizeRendered = this.canvasSize;
    }
}
