import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightJ extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(230, 73%, 60%)"); }
}
