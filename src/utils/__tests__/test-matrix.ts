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
                offsets: [0],
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
                offsets: [1, 3],
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

    describe("highestBlock", () => {
        it("detects highest block", () => expect(new Matrix(vec2(4, 6), [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            1, 0, 0, 0,
            1, 1, 0, 0,
            1, 1, 1, 0,
        ]).highestBlock).toBe(2));
    });

    describe("holes", () => {
        it("detects one hole in matrix A", () => expect(matrixA.holes).toBe(1));

        it("detects two holes in matrix B", () => expect(matrixB.holes).toBe(2));

        it("detects no holes in tetrimino A", () => expect(tetriminoA.holes).toBe(0));
    });
});
