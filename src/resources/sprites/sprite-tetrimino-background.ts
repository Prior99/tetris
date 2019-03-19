import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasTetriminoBackground from "assets/tetrimino-background.json";

@external
export class SpriteTetriminoBackground extends Sprite {
    constructor() { super(atlasTetriminoBackground); }
}
