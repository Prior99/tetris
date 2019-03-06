import { EffectInfo, Effect } from "types";

export class Effects {
    public effects: EffectInfo<any>[] = [];

    public timeSinceLastDouble?: number;
    public timeSinceLastTriple?: number;
    public timeSinceLastTetris?: number;

    private timeCurrent = 0;

    public tick(time: number) {
        this.timeCurrent = time;
    }

    public report<T extends Effect>(effect: T) {
        const info: Partial<EffectInfo<T>> = {
            date: new Date(),
            effect,
        };
        info.consume = () => this.effects = this.effects.filter(current => current !== info);
        this.effects.push(info as EffectInfo<T>);
    }

    public reportLines(count: number) {
        switch (count) {
            case 2: this.timeSinceLastDouble = this.timeCurrent; break;
            case 3: this.timeSinceLastTriple = this.timeCurrent; break;
            case 4: this.timeSinceLastTetris = this.timeCurrent; break;
        }
    }
}
