import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo5 from "assets/combo-5.json";

@external
export class SpriteCombo5 extends Sprite {
    constructor() { super(atlasCombo5); }
}
