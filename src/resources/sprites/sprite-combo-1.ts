import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo1 from "assets/combo-1.json";

@external
export class SpriteCombo1 extends Sprite {
    constructor() { super(atlasCombo1); }
}
