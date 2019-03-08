import { createCanvas, Canvas } from "canvas";
import { vec2 } from "utils";
import { SpriteManager, allSprites, Sprite } from "..";

describe("Loader", () => {
    allSprites.forEach(({ name, sprite: spriteClass }) => {
        describe(`Sprite ${name}`, () => {
            it("is loaded and drawable", () => {
                const sprite: Sprite = tsdi.get(SpriteManager).sprite(spriteClass);
                const canvas: Canvas = createCanvas();

                canvas.width = sprite.dimensions.x;
                canvas.height = sprite.dimensions.y;

                sprite.render(vec2(0, 0), sprite.dimensions, canvas.getContext("2d"), 0);

                expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
            });
        });
    });
});
