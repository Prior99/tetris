import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoS from "../../assets/tetrimino-s.json";

@external
export class SpriteTetriminoS extends Sprite {
    constructor() { super(atlasTetriminoS); }
}
