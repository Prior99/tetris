import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightGhost extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(75, 62%, 78%)"); }
}
