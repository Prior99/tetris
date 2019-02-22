import { component, inject } from "tsdi";
import { AudioManager } from "./audio-manager";
import { Audio } from "./audio";

export type Constructable<T> = new() => T;

@component
export class Sounds {
    @inject private audioManager: AudioManager;
    @inject("AudioContext") private audioContext: AudioContext;

    public play(audioClass: Constructable<Audio>) {
        const audio = this.audioManager.audio(audioClass);
        const { gain, source } = audio.createSource();
        gain.connect(this.audioContext.destination);
        source.start();
    }
}
