import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorNightSky from "assets/floor-night-sky.json";

@external
export class SpriteFloorNightSky extends SpriteFloor {
    constructor() { super(atlasFloorNightSky); }
}
