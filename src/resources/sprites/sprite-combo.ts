import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo from "assets/combo.json";

@external
export class SpriteCombo extends Sprite {
    constructor() { super(atlasCombo); }
}
