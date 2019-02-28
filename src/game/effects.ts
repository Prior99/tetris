import { component } from "tsdi";

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

@component
export class Effects {
    public effects: EffectInfo<any>[] = [];

    public report<T extends Effect>(effect: T) {
        const info: Partial<EffectInfo<T>> = {
            date: new Date(),
            effect,
        };
        info.consume = () => this.effects = this.effects.filter(current => current !== info);
        this.effects.push(info as EffectInfo<T>);
    }
}
