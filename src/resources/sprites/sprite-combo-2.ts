import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo2 from "assets/combo-2.json";

@external
export class SpriteCombo2 extends Sprite {
    constructor() { super(atlasCombo2); }
}
