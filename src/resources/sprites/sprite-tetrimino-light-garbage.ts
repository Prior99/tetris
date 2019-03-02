import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightGarbage extends Sprite {
    constructor() { super(atlasTetriminoLight); }
}
