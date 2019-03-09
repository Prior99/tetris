import { createCanvas, Canvas } from "canvas";
import { Game } from "game";
import { vec2, Matrix, matrixInitializer } from "utils";
import { GameMode } from "types";
import { mockGame } from "test-utils";
import { GraphicsGame } from "..";

describe("GraphicsGame", () => {
    let graphics: GraphicsGame;
    let canvas: Canvas;

    beforeEach(() => {
        canvas = createCanvas(320, 640);
        graphics = new GraphicsGame(mockGame() as Game);
        graphics.rescale(vec2(320, 640));
        graphics.updateCanvas(canvas);
        graphics.render();
    });

    it("matches the screenshot", () => expect(canvas.toBuffer("image/png")).toMatchImageSnapshot());
});
