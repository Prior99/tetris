import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasScoreDouble from "assets/score-double.json";

@external
export class SpriteScoreDouble extends Sprite {
    constructor() { super(atlasScoreDouble); }
}
