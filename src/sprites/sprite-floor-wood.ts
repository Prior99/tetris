import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorWood from "assets/floor-wood.json";

@external
export class SpriteFloorWood extends SpriteFloor {
    constructor() { super(atlasFloorWood); }
}
