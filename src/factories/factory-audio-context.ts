import { component, factory } from "tsdi";

@component
export class FactoryAudioContext {
    private audioContext: AudioContext;

    public async initialize() {
        this.audioContext = new AudioContext();
    }

    @factory({ name: "AudioContext" })
    public getAudioContext(): AudioContext {
        return this.audioContext;
    }
}
