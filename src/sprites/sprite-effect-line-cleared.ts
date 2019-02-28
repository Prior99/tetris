import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasEffectLineCleared from "assets/effect-line-cleared.json";

@external
export class SpriteEffectLineCleared extends Sprite {
    constructor() { super(atlasEffectLineCleared); }
}
