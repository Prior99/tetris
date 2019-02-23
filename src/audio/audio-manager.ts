import { component } from "tsdi";
import { Audio } from "./audio";
import { Constructable } from "types";

@component
export class AudioManager {
    private audios = new Map<Constructable<Audio>, Audio>();

    public async load(AudioClass: Constructable<Audio>) {
        try {
            const audio = new AudioClass();
            await audio.load();
            this.audios.set(AudioClass, audio);
        } catch (err) {
            throw err;
        }
    }

    public audio<T extends Audio>(clazz: Constructable<T>): T {
        if (!this.audios.has(clazz)) {
            throw new Error(`Attempted to get audio which was not loaded: ${clazz.name}`);
        }
        return this.audios.get(clazz)! as T;
    }
}
