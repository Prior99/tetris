import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoO from "../../assets/tetrimino-o.json";

@external
export class SpriteTetriminoO extends Sprite {
    constructor() { super(atlasTetriminoO); }
}
