import { Matrix } from "../matrix";
import { vec2 } from "utils";

describe("Matrix", () => {
    let matrixA: Matrix;
    let matrixB: Matrix;
    let tetriminoA: Matrix;

    beforeEach(() => {
        matrixA = new Matrix(vec2(4, 6), [
            0, 0, 0, 0,
            0, 0, 3, 0,
            0, 0, 3, 3,
            0, 1, 0, 3,
            0, 1, 2, 2,
            1, 1, 2, 2,
        ]);
        matrixB = new Matrix(vec2(4, 6), [
            0, 0, 0, 0,
            4, 3, 0, 0,
            4, 3, 3, 3,
            4, 1, 2, 0,
            4, 1, 2, 2,
            1, 1, 2, 0,
        ]);
        tetriminoA = new Matrix(vec2(4, 4), [
            0, 0, 0, 0,
            0, 1, 0, 0,
            0, 1, 1, 1,
            0, 0, 0, 0,
        ]);
    });

    describe("equals", () => {
        it("returns true for the same matrix", () => expect(matrixA.equals(matrixA)).toBe(true));

        it("returns false for another matrix", () => expect(matrixA.equals(matrixB)).toBe(false));
    });

    describe("rotateLeft", () => {
        it("rotates matrix A", () => {
            expect(matrixA.rotateLeft()).toEqual(new Matrix(vec2(6, 4), [
                0, 0, 3, 3, 2, 2,
                0, 3, 3, 0, 2, 2,
                0, 0, 0, 1, 1, 1,
                0, 0, 0, 0, 0, 1,
            ]));
        });
    });

    describe("rotateRight", () => {
        it("rotates matrix A", () => {
            expect(matrixA.rotateRight()).toEqual(new Matrix(vec2(6, 4), [
                1, 0, 0, 0, 0, 0,
                1, 1, 1, 0, 0, 0,
                2, 2, 0, 3, 3, 0,
                2, 2, 3, 3, 0, 0,
            ]));
        });
    });

    describe("rotate180", () => {
        it("rotates matrix A", () => {
            expect(matrixA.rotate180()).toEqual(new Matrix(vec2(4, 6), [
                2, 2, 1, 1,
                2, 2, 1, 0,
                3, 0, 1, 0,
                3, 3, 0, 0,
                0, 3, 0, 0,
                0, 0, 0, 0,
            ]));
        });
    });

    describe("emptyAt", () => {
        it("detects empty cell as empty", () => expect(matrixA.emptyAt(vec2(3, 4))).toBe(true));

        it("detects non-empty cell as not empty", () => expect(matrixA.emptyAt(vec2(2, 4))).toBe(false));
    });

    describe("at", () => {
        it("returns correct cell color", () => expect(matrixA.at(vec2(2, 4))).toBe(3));
    });

    describe("size", () => {
        it("detects the size", () => expect(matrixA.size).toBe(24));
    });

    describe("fits", () => {
        [vec2(-1, 0), vec2(1, 0), vec2(0, 3)].forEach((offset) => {
            it(`returns false for offset ${offset.x},${offset.y}`, () => {
                expect(matrixA.fits(tetriminoA, offset)).toBe(false);
            });
        });

        [vec2(0, 0), vec2(0, 2)].forEach((offset) => {
            it(`returns true for offset ${offset.x},${offset.y}`, () => {
                expect(matrixA.fits(tetriminoA, offset)).toBe(true);
            });
        });
    });

    describe("fullHorizontals", () => {
        it("detects full horizontal lines on matrix A", () => expect(matrixA.fullHorizontals).toEqual([0]));

        it("detects full horizontal lines on matrix B", () => expect(matrixB.fullHorizontals).toEqual([1, 3]));
    });

    describe("removeHorizontals", () => {
        it("removes the horizontals from matrix A", () => {
            expect(matrixA.removeHorizontals()).toEqual({
                matrix: new Matrix(vec2(4, 6), [
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 3, 0,
                    0, 0, 3, 3,
                    0, 1, 0, 3,
                    0, 1, 2, 2,
                ]),
                count: 1,
            });
        });

        it("removes the horizontals from matrix B", () => {
            expect(matrixB.removeHorizontals()).toEqual({
                matrix: new Matrix(vec2(4, 6), [
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    4, 3, 0, 0,
                    4, 1, 2, 0,
                    1, 1, 2, 0,
                ]),
                count: 2,
            });
        });
    });

    describe("collides", () => {
        let colliding: Matrix;

        beforeEach(() => {
            colliding = new Matrix(vec2(3, 2), [
                5, 5, 5,
                5, 0, 0,
            ]);
        });

        it("detects a collision", () => {
            expect(matrixA.collides(colliding, vec2(0, 4))).toBe(false);
        });

        it("doesn't detect a non-collision", () => {
            expect(matrixA.collides(colliding, vec2(0, 3))).toBe(true);
        });
    });

    describe("overlay", () => {
        it("works as expected", () => {
            expect(matrixA.overlay(tetriminoA, vec2(0, 2))).toEqual(new Matrix(vec2(4, 6), [
                0, 0, 0, 0,
                0, 1, 3, 0,
                0, 1, 1, 1,
                0, 1, 0, 3,
                0, 1, 2, 2,
                1, 1, 2, 2,
            ]));
        });
    });

    describe("moveUp", () => {
        it("moves the lines up", () => {
            expect(matrixA.moveUp(4)).toEqual(new Matrix(vec2(4, 6), [
                0, 1, 2, 2,
                1, 1, 2, 2,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
            ]));
        });
    });
});
