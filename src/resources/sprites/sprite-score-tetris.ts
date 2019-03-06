import { external } from "tsdi";
import { Sprite } from "./sprite";
import * as atlasScoreTetris from "assets/score-tetris.json";

@external
export class SpriteScoreTetris extends Sprite {
    constructor() { super(atlasScoreTetris); }
}
