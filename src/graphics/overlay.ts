import { component, initialize, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { vec2 } from "utils";
import { Game } from "game";
import { Graphics } from "./graphics";
import {
    SpriteIncomingAlert,
    SpriteScoreDouble,
    SpriteScoreTriple,
    SpriteScoreTetris,
    Sprite,
    SpriteCombo,
    SpriteCombo1,
    SpriteCombo2,
    SpriteCombo3,
    SpriteCombo4,
    SpriteCombo5,
    SpriteCombo6,
} from "resources";
import { Constructable } from "types";

function comboCountSprite(count: number): Constructable<Sprite> {
    switch (count) {
        case 2: return SpriteCombo1;
        case 3: return SpriteCombo2;
        case 4: return SpriteCombo3;
        case 5: return SpriteCombo4;
        case 6: return SpriteCombo5;
        default: return SpriteCombo6;
    }
}

@component
export class Overlay extends Graphics {
    @inject private game: Game;

    @initialize
    protected async initialize() {
        this.updateCanvas(document.createElement("canvas"));
    }

    private renderIncomingAlert() {
        const sprite = this.sprites.sprite(SpriteIncomingAlert);
        const { latestIncomingGarbage } = this.game;
        if (!latestIncomingGarbage) { return; }
        const time = this.game.seconds - latestIncomingGarbage.time;
        const difference = this.config.garbageTimeout - sprite.totalDuration;
        if (time > difference && time < this.config.garbageTimeout) {
            this.renderSprite(
                SpriteIncomingAlert,
                vec2(0, 0),
                sprite.dimensions.mult(this.scaleFactor),
                time - difference,
            );
        }
    }

    private renderDouble() {
        const { timeSinceLastDouble } = this.game;
        if (!timeSinceLastDouble) { return; }
        this.renderScoreSplash(timeSinceLastDouble, SpriteScoreDouble);
    }

    private renderTriple() {
        const { timeSinceLastTriple } = this.game;
        if (!timeSinceLastTriple) { return; }
        this.renderScoreSplash(timeSinceLastTriple, SpriteScoreTriple);
    }

    private renderTetris() {
        const { timeSinceLastTetris } = this.game;
        if (!timeSinceLastTetris) { return; }
        this.renderScoreSplash(timeSinceLastTetris, SpriteScoreTetris);
    }

    private renderScoreSplash(lastTime: number, spriteClass: Constructable<Sprite>) {
        const sprite = this.sprites.sprite(spriteClass);
        const time = this.game.seconds - lastTime;
        const offset = this.pixelSize.sub(sprite.dimensions.mult(this.scaleFactor)).div(vec2(1, 2));
        if (time < sprite.totalDuration) {
            this.renderSprite(spriteClass, offset, sprite.dimensions.mult(this.scaleFactor), time);
        }
    }

    private renderComboSplash() {
        const { timeSinceComboStart, timeSinceComboEnd } = this.game;
        const sprite = this.sprites.sprite(SpriteCombo);
        const offset = this.pixelSize
            .sub(sprite.dimensions.mult(this.scaleFactor))
            .div(vec2(1, 2))
            .sub(vec2(0, 32).mult(this.scaleFactor));
        if (timeSinceComboStart) {
            const time = Math.min(this.game.seconds - timeSinceComboStart, SpriteCombo.timeUntilFull - 0.1);
            this.renderSprite(SpriteCombo, offset, sprite.dimensions.mult(this.scaleFactor), time);
        }
        if (timeSinceComboEnd) {
            const time = this.game.seconds - timeSinceComboEnd;
            if (time <= sprite.totalDuration) {
                this.renderSprite(SpriteCombo, offset, sprite.dimensions.mult(this.scaleFactor), time);
            }
        }
    }

    private renderComboCount() {
        this.game.comboCounts.forEach(({ count, time }, index) => {
            const latest = index === this.game.comboCounts.length - 1;
            const timeNext = latest ? 0 : this.game.comboCounts[index + 1].time;
            const timeSince = this.game.seconds - time;
            const spriteClass = comboCountSprite(count);
            const sprite = this.sprites.sprite(spriteClass);
            if (timeSince > sprite.totalDuration && !latest) { return; }
            const offset = this.pixelSize
                .sub(sprite.dimensions.mult(this.scaleFactor))
                .div(vec2(1, 2))
                .sub(vec2(40, 80).mult(this.scaleFactor));
            const animationTime = latest ? Math.min(0.24, timeSince) : this.game.seconds - timeNext + 0.25;
            this.renderSprite(spriteClass, offset, sprite.dimensions.mult(this.scaleFactor), animationTime);
        });
    }

    @bind public render() {
        this.renderClear();
        this.ctx.globalAlpha = 0.7;
        this.renderIncomingAlert();
        this.renderDouble();
        this.renderTriple();
        this.renderTetris();
        this.renderComboSplash();
        this.renderComboCount();
    }
}
