import { CellColor } from "game";
import {
    SpriteTetriminoI,
    SpriteTetriminoJ,
    SpriteTetriminoL,
    SpriteTetriminoO,
    SpriteTetriminoS,
    SpriteTetriminoT,
    SpriteTetriminoZ,
    SpriteTetriminoGhost,
    Sprite,
} from "sprites";

import { Constructable } from "types";

export function spriteForCellColor(cellColor: CellColor): Constructable<Sprite> | undefined {
    switch (cellColor) {
        case CellColor.TETRIMINO_I: return SpriteTetriminoI;
        case CellColor.TETRIMINO_J: return SpriteTetriminoJ;
        case CellColor.TETRIMINO_L: return SpriteTetriminoL;
        case CellColor.TETRIMINO_O: return SpriteTetriminoO;
        case CellColor.TETRIMINO_S: return SpriteTetriminoS;
        case CellColor.TETRIMINO_T: return SpriteTetriminoT;
        case CellColor.TETRIMINO_Z: return SpriteTetriminoZ;
        case CellColor.GHOST: return SpriteTetriminoGhost;
    }
}
