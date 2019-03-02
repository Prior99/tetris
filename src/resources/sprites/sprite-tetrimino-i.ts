import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasTetriminoI from "assets/tetrimino-i.json";

@external
export class SpriteTetriminoI extends Sprite {
    constructor() { super(atlasTetriminoI); }
}
