import { createCanvas, Canvas } from "canvas";
import { vec2, Matrix, matrixInitializer } from "utils";
import { GameMode, Mutable } from "types";
import { mockGame } from "test-utils";
import { Game } from "game";
import { GraphicsBackground } from "../graphics-background";

describe("Background", () => {
    let graphics: GraphicsBackground;
    let canvas: Canvas;
    let game: Mutable<Game>;

    beforeEach(() => {
        game = mockGame();
        canvas = createCanvas(320, 640);
        graphics = new GraphicsBackground(game as Game);
        graphics.rescale(vec2(320, 640));
        graphics.updateCanvas(canvas);
        graphics.render();
    });

    for (let level = 0; level <= 21; ++level) {
        describe(`at level ${level}`, () => {
            beforeEach(() => {
                game.level = level;
                graphics.render();
            });

            it("matches the screenshot", () => expect(canvas.toBuffer("image/png")).toMatchImageSnapshot());
        });
    }
});
