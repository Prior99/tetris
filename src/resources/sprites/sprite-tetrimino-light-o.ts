import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightO extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(56, 73%, 60%)"); }
}
