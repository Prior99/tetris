import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { GameState } from "game";
import { vec2, Vec2 } from "utils";
import { SpriteFloorWhiteTiles, SpriteFloorWood, SpriteFloorTetris, SpriteFloorStars }  from "sprites";
import { Graphics } from "./graphics";

@component
export class Background extends Graphics {
    @inject private gameState: GameState;

    private lastLevelRendered?: number;
    private lastResizeRendered?: Vec2;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    protected get spriteClass() {
        const { level } = this.gameState;
        if (level < 1) { return SpriteFloorTetris; }
        if (level < 2) { return SpriteFloorStars; }
        if (level < 3) { return SpriteFloorWood; }
        return SpriteFloorWhiteTiles;
    }

    protected get sprite() {
        return this.sprites.sprite(this.spriteClass);
    }

    private get shouldRender() {
        return this.lastLevelRendered !== this.gameState.level || (
            !this.lastResizeRendered || !this.lastResizeRendered.equals(this.pixelSize)
        );
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
        this.lastLevelRendered = this.gameState.level;
        this.lastResizeRendered = this.pixelSize;
    }
}
