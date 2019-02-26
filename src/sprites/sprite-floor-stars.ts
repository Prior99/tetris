import { external } from "tsdi";
import { SpriteFloor } from "./sprite-floor";
import * as atlasFloorStars from "assets/floor-stars.json";

@external
export class SpriteFloorStars extends SpriteFloor {
    constructor() { super(atlasFloorStars); }
}
