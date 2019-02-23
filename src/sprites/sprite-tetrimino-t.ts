import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoT from "../../assets/tetrimino-t.json";

@external
export class SpriteTetriminoT extends Sprite {
    constructor() { super(atlasTetriminoT); }
}
