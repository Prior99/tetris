import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasIncomingAlert from "assets/incoming-alert.json";

@external
export class SpriteIncomingAlert extends Sprite {
    constructor() { super(atlasIncomingAlert); }
}
