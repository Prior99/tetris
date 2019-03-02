import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorTetris from "assets/floor-tetris.json";

@external
export class SpriteFloorTetris extends SpriteFloor {
    constructor() { super(atlasFloorTetris); }
}
