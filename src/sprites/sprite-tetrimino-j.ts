import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoJ from "../../assets/tetrimino-j.json";

@external
export class SpriteTetriminoJ extends Sprite {
    constructor() { super(atlasTetriminoJ); }
}
