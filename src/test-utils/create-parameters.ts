import { GameParameters, GarbageMode, GameMode, WinningConditionType } from "types";

export function createParameters(): GameParameters {
    return {
        seed: "some-seed",
        garbageMode: GarbageMode.HALF_REFERRED,
        gameMode: GameMode.SINGLE_PLAYER,
        initialGarbageLines: 2,
        initialLevel: 0,
        levelUpDisabled: false,
        winningCondition: { condition: WinningConditionType.HIGHEST_SCORE_ONE_GAME },
    };
}
