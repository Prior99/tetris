import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoZ from "../../assets/tetrimino-z.json";

@external
export class SpriteTetriminoZ extends Sprite {
    constructor() { super(atlasTetriminoZ); }
}
