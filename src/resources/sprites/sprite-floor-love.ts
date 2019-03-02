import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorLove from "assets/floor-love.json";

@external
export class SpriteFloorLove extends SpriteFloor {
    constructor() { super(atlasFloorLove); }
}
