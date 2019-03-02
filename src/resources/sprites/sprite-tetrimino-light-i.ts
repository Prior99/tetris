import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightI extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(200, 73%, 60%)"); }
}
