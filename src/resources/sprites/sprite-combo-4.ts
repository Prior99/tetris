import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo4 from "assets/combo-4.json";

@external
export class SpriteCombo4 extends Sprite {
    constructor() { super(atlasCombo4); }
}
