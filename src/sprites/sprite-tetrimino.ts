import { Sprite } from "../sprite";
import * as atlasTetrimino from "../../assets/tetriminos.json";

export class SpriteTetrimino extends Sprite {
    constructor() {
        super(atlasTetrimino);
    }
}
