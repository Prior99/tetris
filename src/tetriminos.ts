import { Matrix } from "./matrix";
import { vec2, Vec2 } from "./vec2";
import { CellColor } from "./cell-color";
import { ShuffleBag } from "./shuffle-bag";

function tetrimino(dimensions: Vec2, cellColor: CellColor, initialization: (1 | 0)[]) {
    return new Matrix(dimensions, initialization.map(notEmpty => notEmpty === 1 ? cellColor : CellColor.EMPTY));
}

function tetriminoI() {
    return tetrimino(vec2(1, 4), CellColor.TETRIMINO_I, [
        1,
        1,
        1,
        1,
    ]);
}

function tetriminoJ() {
    return tetrimino(vec2(2, 3), CellColor.TETRIMINO_J, [
        0, 1,
        0, 1,
        1, 1,
    ]);
}

function tetriminoL() {
    return tetrimino(vec2(2, 3), CellColor.TETRIMINO_L, [
        1, 0,
        1, 0,
        1, 1,
    ]);
}

function tetriminoO() {
    return tetrimino(vec2(2, 2), CellColor.TETRIMINO_O, [
        1, 1,
        1, 1,
    ]);
}

function tetriminoS() {
    return tetrimino(vec2(3, 2), CellColor.TETRIMINO_S, [
        0, 1, 1,
        1, 1, 0,
    ]);
}

function tetriminoT() {
    return tetrimino(vec2(3, 2), CellColor.TETRIMINO_T, [
        1, 1, 1,
        0, 1, 0,
    ]);
}

function tetriminoZ() {
    return tetrimino(vec2(3, 2), CellColor.TETRIMINO_Z, [
        1, 1, 0,
        0, 1, 1,
    ]);
}

const allTetriminos = [
    tetriminoI,
    tetriminoJ,
    tetriminoL,
    tetriminoO,
    tetriminoS,
    tetriminoT,
    tetriminoZ,
];

export function tetriminos(): ShuffleBag<Matrix> {
    const bag = new ShuffleBag<Matrix>();
    allTetriminos.forEach((tetrimino) => {
        bag.add(tetrimino());
        bag.add(tetrimino().rotateLeft());
        bag.add(tetrimino().rotateRight());
        bag.add(tetrimino().rotate180());
    });
    return bag;
}
