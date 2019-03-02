import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorCarpet from "assets/floor-carpet.json";

@external
export class SpriteFloorCarpet extends SpriteFloor {
    constructor() { super(atlasFloorCarpet); }
}
