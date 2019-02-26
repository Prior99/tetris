import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightS extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(104, 73%, 60%)"); }
}
