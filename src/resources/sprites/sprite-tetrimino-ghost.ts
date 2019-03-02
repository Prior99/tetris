import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasTetriminoGhost from "assets/tetrimino-ghost.json";

@external
export class SpriteTetriminoGhost extends Sprite {
    constructor() { super(atlasTetriminoGhost); }
}
