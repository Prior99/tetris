import { Matrix } from "./matrix";
import { CellColor } from "./cell-color";
import { ShuffleBag } from "./shuffle-bag";

function tetrimino(cellColor: CellColor, initialization: (1 | 0)[]) {
    return new Matrix(4, 4, initialization.map(notEmpty => notEmpty === 1 ? cellColor : CellColor.EMPTY));
}

function tetriminoI() {
    return tetrimino(CellColor.TETRIMINO_I, [
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
    ]);
}

function tetriminoJ() {
    return tetrimino(CellColor.TETRIMINO_J, [
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 1, 1, 0,
        0, 0, 0, 0,
    ]);
}

function tetriminoL() {
    return tetrimino(CellColor.TETRIMINO_L, [
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 1, 0,
        0, 0, 0, 0,
    ]);
}

function tetriminoO() {
    return tetrimino(CellColor.TETRIMINO_O, [
        0, 0, 0, 0,
        0, 1, 1, 0,
        0, 1, 1, 0,
        0, 0, 0, 0,
    ]);
}

function tetriminoS() {
    return tetrimino(CellColor.TETRIMINO_S, [
        0, 0, 0, 0,
        0, 1, 1, 0,
        1, 1, 0, 0,
        0, 0, 0, 0,
    ]);
}

function tetriminoT() {
    return tetrimino(CellColor.TETRIMINO_T, [
        0, 0, 0, 0,
        1, 1, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
    ]);
}

function tetriminoZ() {
    return tetrimino(CellColor.TETRIMINO_Z, [
        0, 0, 0, 0,
        1, 1, 0, 0,
        0, 1, 1, 0,
        0, 0, 0, 0,
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
