import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasCountdown from "assets/countdown.json";

@external
export class SpriteCountdown extends Sprite {
    public static timeUntilFull = 0.5;

    constructor() { super(atlasCountdown); }
}
