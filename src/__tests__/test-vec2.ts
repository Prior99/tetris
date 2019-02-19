import { vec2, Vec2 } from "../vec2";

describe("Vec2", () => {
    describe("constructing", () => {
        it("stores the data", () => {
            const result = vec2(27, 3);
            expect(result.x).toBe(27);
            expect(result.y).toBe(3);
            expect(result.constructor).toBe(Vec2);
        });
    });

    describe("add", () => {
        it("sums up both vectors", () => expect(vec2(2, 3).add(vec2(4, 4))).toEqual(vec2(6, 7)));
    });
});
