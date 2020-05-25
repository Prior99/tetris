import { createCanvas, Canvas } from "canvas";
import { Matrix } from "utils";
import { mockPlayfield } from "test-utils";
import { GraphicsRemoteGame } from "..";

describe("GraphicsRemoteGame", () => {
    let graphics: GraphicsRemoteGame;
    let matrix: Matrix;
    let canvas: Canvas;

    beforeEach(() => {
        canvas = createCanvas(320, 640);
        matrix = mockPlayfield();
        graphics = new GraphicsRemoteGame(matrix);
        graphics.updateCanvas(canvas as any);
        graphics.render();
    });

    it("matches the screenshot", () => expect(canvas.toBuffer("image/png")).toMatchImageSnapshot());
});
