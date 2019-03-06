import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo3 from "assets/combo-3.json";

@external
export class SpriteCombo3 extends Sprite {
    constructor() { super(atlasCombo3); }
}
