import { component } from "tsdi";

export function musicSpeedForLevel() {
    return 0;
}

@component
export class Sounds {
    public play = jest.fn();
    public stopMusic = jest.fn();
    public setMode = jest.fn();
    public changeMusicSpeed = jest.fn();

    public get time() {
        return 0;
    }
}
