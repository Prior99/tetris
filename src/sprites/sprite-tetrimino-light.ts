import { external } from "tsdi";
import { Sprite } from "../sprite";
import * as atlasTetriminoLight from "../../assets/tetrimino-light.json";

@external
export class SpriteTetriminoLight extends Sprite {
    constructor() { super(atlasTetriminoLight); }
}
