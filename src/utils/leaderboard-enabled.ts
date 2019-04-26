import { GameParameters, WinningConditionType } from "types";

const allowedConditions = [WinningConditionType.HIGHEST_SCORE_ONE_GAME, WinningConditionType.BATTLE_ROYALE];

export function leaderboardEnabled(parameters: GameParameters): boolean {
    if (!allowedConditions.includes(parameters.winningCondition.condition)) { return false; }
    if (parameters.winningCondition.condition === WinningConditionType.BATTLE_ROYALE) {
        if (parameters.winningCondition.lives != 1) { return false; }
    }
    if (parameters.initialLevel !== 0) { return false; }
    if (parameters.levelUpDisabled) { return false; }
    return true;
}
