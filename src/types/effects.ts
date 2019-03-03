export enum EffectType {
    LINES_CLEARED,
    LINE_CLEARED,
}

export interface EffectLineCleared {
    effect: EffectType.LINE_CLEARED;
    y: number;
}

export interface EffectLinesCleared {
    effect: EffectType.LINES_CLEARED;
    count: number;
}

export type Effect = EffectLineCleared | EffectLinesCleared;

export interface EffectInfo<T extends Effect> {
    date: Date;
    effect: T;
    consume: () => void;
}
