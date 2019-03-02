import { CellColor } from "game";
import {
    SpriteTetriminoI,
    SpriteTetriminoJ,
    SpriteTetriminoL,
    SpriteTetriminoO,
    SpriteTetriminoS,
    SpriteTetriminoT,
    SpriteTetriminoZ,
    SpriteTetriminoLightI,
    SpriteTetriminoLightJ,
    SpriteTetriminoLightL,
    SpriteTetriminoLightO,
    SpriteTetriminoLightS,
    SpriteTetriminoLightT,
    SpriteTetriminoLightZ,
    SpriteTetriminoLightGhost,
    SpriteTetriminoLightGarbage,
    SpriteTetriminoOther,
    SpriteTetriminoGhost,
    Sprite,
} from "resources";

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
        case CellColor.GARBAGE: return SpriteTetriminoOther;
        case CellColor.GHOST: return SpriteTetriminoGhost;
    }
}

export function lightSpriteForCellColor(cellColor: CellColor): Constructable<Sprite> | undefined {
    switch (cellColor) {
        case CellColor.TETRIMINO_I: return SpriteTetriminoLightI;
        case CellColor.TETRIMINO_J: return SpriteTetriminoLightJ;
        case CellColor.TETRIMINO_L: return SpriteTetriminoLightL;
        case CellColor.TETRIMINO_O: return SpriteTetriminoLightO;
        case CellColor.TETRIMINO_S: return SpriteTetriminoLightS;
        case CellColor.TETRIMINO_T: return SpriteTetriminoLightT;
        case CellColor.TETRIMINO_Z: return SpriteTetriminoLightZ;
        case CellColor.GHOST: return SpriteTetriminoLightGhost;
        case CellColor.GARBAGE: return SpriteTetriminoLightGarbage;
    }
}
