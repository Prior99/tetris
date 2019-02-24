import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasTetriminoOther from "assets/tetrimino-other.json";

@external
export class SpriteTetriminoOther extends Sprite {
    constructor() { super(atlasTetriminoOther); }
}
