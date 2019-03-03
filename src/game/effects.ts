import { EffectInfo, Effect } from "types";

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
