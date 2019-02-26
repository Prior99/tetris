import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorBricks from "assets/floor-bricks.json";

@external
export class SpriteFloorBricks extends SpriteFloor {
    constructor() { super(atlasFloorBricks); }
}
