import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo6 from "assets/combo-6.json";

@external
export class SpriteCombo6 extends Sprite {
    constructor() { super(atlasCombo6); }
}
