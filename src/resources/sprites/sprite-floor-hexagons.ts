import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorHexagons from "assets/floor-hexagons.json";

@external
export class SpriteFloorHexagons extends SpriteFloor {
    constructor() { super(atlasFloorHexagons); }
}
