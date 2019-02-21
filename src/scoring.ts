export enum ScoreActionType {
    SINGLE = "single",
    DOUBLE = "double",
    TRIPLE = "triple",
    TETRIS = "tetris",
    COMBO = "combo",
    SOFT_DROP = "soft drop",
    HARD_DROP = "hard drop",
    T_SPIN = "t spin",
    T_SPIN_MINI = "t spin mini",
    T_SPIN_TRIPLE = "t spin triple",
    T_SPIN_B2B_MINI = "t spin b2b mini",
    T_SPIN_B2B_DOUBLE = "t spin b2b double",
    T_SPIN_B2B_TRIPLE = "t spin triple",
}

export type ScoreAction =
    {
        action: ScoreActionType.SINGLE;
        level: number;
    } | {
        action: ScoreActionType.DOUBLE;
        level: number;
    } | {
        action: ScoreActionType.TRIPLE;
        level: number;
    } | {
        action: ScoreActionType.TETRIS;
        level: number;
    } | {
        comboAction: ScoreActionType;
        action: ScoreActionType.COMBO;
        comboCount: number;
        level: number;
    } | {
        action: ScoreActionType.SOFT_DROP;
        cells: number;
    } | {
        action: ScoreActionType.HARD_DROP;
        cells: number;
    } | {
        action: ScoreActionType.T_SPIN;
        level: number;
    } | {
        action: ScoreActionType.T_SPIN_MINI;
        level: number;
    } | {
        action: ScoreActionType.T_SPIN_TRIPLE;
        level: number;
    } | {
        action: ScoreActionType.T_SPIN_B2B_MINI;
        level: number;
    } | {
        action: ScoreActionType.T_SPIN_B2B_DOUBLE;
        level: number;
    } | {
        action: ScoreActionType.T_SPIN_B2B_TRIPLE;
        level: number;
    };

export function scorePointValue(action: ScoreAction): number {
    switch (action.action) {
        case ScoreActionType.SINGLE: return action.level * 100;
        case ScoreActionType.DOUBLE: return action.level * 300;
        case ScoreActionType.TRIPLE: return action.level * 500;
        case ScoreActionType.TETRIS: return action.level * 800;
        case ScoreActionType.COMBO:
            if (action.comboAction !== ScoreActionType.SINGLE || action.level >= 20) {
                return action.comboCount * 50 * action.level;
            }
            return 0;
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
