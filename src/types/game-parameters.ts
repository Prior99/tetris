import { GameMode } from "./game-mode";

export enum WinningConditionType {
    BATTLE_ROYALE = "battle royale",
    HIGHEST_SCORE_ONE_GAME = "highest score one game",
    SUM_IN_TIME = "sum in time",
    CLEAR_GARBAGE = "clear garbage",
}

export type WinningCondition = {
    condition: WinningConditionType.BATTLE_ROYALE;
    lives: number;
} | {
    condition: WinningConditionType.HIGHEST_SCORE_ONE_GAME;
} | {
    condition: WinningConditionType.SUM_IN_TIME;
    seconds: number;
} | {
    condition: WinningConditionType.CLEAR_GARBAGE;
};

export enum GarbageMode {
    NONE = "none",
    INITIAL_ONLY = "initial only",
    HALF_REFERRED = "half referred",
    FULL_REFERRED = "full referred",
}

export interface GameParameters {
    winningCondition: WinningCondition;
    gameMode: GameMode;
    seed: string;
    initialGarbageLines: number;
    garbageMode: GarbageMode;
    initialLevel: number;
    levelUpDisabled: boolean;
}
