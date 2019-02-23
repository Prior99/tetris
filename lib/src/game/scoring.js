"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScoreActionType;
(function (ScoreActionType) {
    ScoreActionType["SINGLE"] = "single";
    ScoreActionType["DOUBLE"] = "double";
    ScoreActionType["TRIPLE"] = "triple";
    ScoreActionType["TETRIS"] = "tetris";
    ScoreActionType["COMBO"] = "combo";
    ScoreActionType["SOFT_DROP"] = "soft drop";
    ScoreActionType["HARD_DROP"] = "hard drop";
    ScoreActionType["T_SPIN"] = "t spin";
    ScoreActionType["T_SPIN_MINI"] = "t spin mini";
    ScoreActionType["T_SPIN_TRIPLE"] = "t spin triple";
    ScoreActionType["T_SPIN_B2B_MINI"] = "t spin b2b mini";
    ScoreActionType["T_SPIN_B2B_DOUBLE"] = "t spin b2b double";
    ScoreActionType["T_SPIN_B2B_TRIPLE"] = "t spin triple";
})(ScoreActionType = exports.ScoreActionType || (exports.ScoreActionType = {}));
function scorePointValue(action) {
    switch (action.action) {
        case ScoreActionType.SINGLE: return action.level * 100;
        case ScoreActionType.DOUBLE: return action.level * 300;
        case ScoreActionType.TRIPLE: return action.level * 500;
        case ScoreActionType.TETRIS: return action.level * 800;
        case ScoreActionType.COMBO:
            if (action.comboCount < 2) {
                return 0;
            }
            return action.comboCount * 50 * action.level;
        case ScoreActionType.SOFT_DROP: return Math.min(action.cells, 20);
        case ScoreActionType.HARD_DROP: return Math.min(action.cells * 2, 40);
        case ScoreActionType.T_SPIN: return action.level * 400;
        case ScoreActionType.T_SPIN_MINI: return action.level * 200;
        case ScoreActionType.T_SPIN_TRIPLE: return action.level * 1600;
        case ScoreActionType.T_SPIN_B2B_MINI: return action.level * 150;
        case ScoreActionType.T_SPIN_B2B_DOUBLE: return action.level * 1800;
        case ScoreActionType.T_SPIN_B2B_TRIPLE: return action.level * 2400;
    }
}
exports.scorePointValue = scorePointValue;
//# sourceMappingURL=scoring.js.map