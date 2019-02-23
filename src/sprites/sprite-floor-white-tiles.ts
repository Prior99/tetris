import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorWhiteTiles from "assets/floor-white-tiles.json";

@external
export class SpriteFloorWhiteTiles extends SpriteFloor {
    constructor() { super(atlasFloorWhiteTiles); }
}
