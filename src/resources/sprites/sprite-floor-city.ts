import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorCity from "assets/floor-city.json";

@external
export class SpriteFloorCity extends SpriteFloor {
    constructor() { super(atlasFloorCity); }
}
