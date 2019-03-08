import { component, factory } from "tsdi";

@component
export class FactoryAudioContext {
    private audioContext: AudioContext;

    @factory({ name: "AudioContext" })
    public getAudioContext(): any {
        return {
            currentTime: 0,
            createBiquadFilter() {
                return {
                    connect: jest.fn(),
                };
            },
            createGain() {
                return {
                    connect: jest.fn(),
                };
            },
        };
    }
}
