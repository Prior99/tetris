import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCombo from "assets/combo.json";

@external
export class SpriteCombo extends Sprite {
    public static timeUntilFull = 0.5;

    constructor() { super(atlasCombo); }
}
