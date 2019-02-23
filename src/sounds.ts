import { component, inject, initialize } from "tsdi";
import { AudioManager } from "./audio-manager";
import { Audio } from "./audio";
import {
    AudioMusic120Bpm,
    AudioMusic130Bpm,
    AudioMusic140Bpm,
    AudioMusic150Bpm,
    AudioMusic160Bpm,
    AudioMusic170Bpm,
} from "./audios";

export type Constructable<T> = new() => T;

export enum MusicSpeed {
    BPM_120,
    BPM_130,
    BPM_140,
    BPM_150,
    BPM_160,
    BPM_170,
}

function musicForSpeed (musicSpeed: MusicSpeed): Constructable<Audio> {
    switch (musicSpeed) {
        case MusicSpeed.BPM_120: return AudioMusic120Bpm;
        case MusicSpeed.BPM_130: return AudioMusic130Bpm;
        case MusicSpeed.BPM_140: return AudioMusic140Bpm;
        case MusicSpeed.BPM_150: return AudioMusic150Bpm;
        case MusicSpeed.BPM_160: return AudioMusic160Bpm;
        case MusicSpeed.BPM_170: return AudioMusic170Bpm;
    }
}

export function musicSpeedForLevel(level: number): MusicSpeed {
    if (level < 2) { return MusicSpeed.BPM_120; }
    if (level < 4) { return MusicSpeed.BPM_130; }
    if (level < 8) { return MusicSpeed.BPM_140; }
    if (level < 12) { return MusicSpeed.BPM_150; }
    if (level < 16) { return MusicSpeed.BPM_160; }
    return MusicSpeed.BPM_170;
}

@component
export class Sounds {
    @inject private audioManager: AudioManager;
    @inject("AudioContext") private audioContext: AudioContext;

    private musicSpeed?: MusicSpeed;
    private timeStarted = 0;
    private currentMusic?: { gain: GainNode, source: AudioBufferSourceNode };

    public get musicAudio() {
        if (typeof this.musicSpeed !== "number") { return; }
        return this.audioManager.audio(musicForSpeed(this.musicSpeed));
    }

    @initialize protected initialize() {
        this.timeStarted = this.audioContext.currentTime;
        this.changeMusicSpeed(MusicSpeed.BPM_120);
    }

    public play(audioClass: Constructable<Audio>) {
        const audio = this.audioManager.audio(audioClass);
        const { gain, source } = audio.createSource();
        gain.connect(this.audioContext.destination);
        source.start();
    }

    public get time() {
        return this.audioContext.currentTime - this.timeStarted;
    }

    private get relativeMusicPosition() {
        if (!this.musicAudio) { return; }
        const { duration } = this.musicAudio;
        const timeInMusic = this.time % duration;
        return timeInMusic / duration;
    }

    public stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.source.stop();
            this.currentMusic.source.disconnect();
            this.currentMusic.gain.disconnect();
        }
    }

    public changeMusicSpeed(speed: MusicSpeed) {
        if (speed === this.musicSpeed) { return; }
        const { relativeMusicPosition } = this;
        this.stopMusic();
        this.musicSpeed = speed;
        const music = this.musicAudio!.createSource();
        const { gain, source } = music;
        this.currentMusic = music;
        gain.connect(this.audioContext.destination);
        source.loop = true;
        source.start(0, relativeMusicPosition ? this.musicAudio!.duration * relativeMusicPosition : 0);
        this.timeStarted = this.audioContext.currentTime;
    }
}
