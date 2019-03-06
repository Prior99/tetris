import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasScoreTriple from "assets/score-triple.json";

@external
export class SpriteScoreTriple extends Sprite {
    constructor() { super(atlasScoreTriple); }
}
