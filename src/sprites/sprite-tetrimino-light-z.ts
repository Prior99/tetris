import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightZ extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(353, 74%, 60%)"); }
}
