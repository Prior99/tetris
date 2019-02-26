import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightT extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(287, 73%, 60%)"); }
}
