import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoL from "../../assets/tetrimino-l.json";

@external
export class SpriteTetriminoL extends Sprite {
    constructor() { super(atlasTetriminoL); }
}
