import { component, inject, initialize } from "tsdi";
import { AudioManager } from "./audio-manager";
import { Audio } from "./audio";
import { AudioMusic120Bpm } from "./audio-music-120bpm";
import { AudioMusic130Bpm } from "./audio-music-130bpm";
import { AudioMusic140Bpm } from "./audio-music-140bpm";
import { AudioMusic150Bpm } from "./audio-music-150bpm";
import { AudioMusic160Bpm } from "./audio-music-160bpm";
import { AudioMusic170Bpm } from "./audio-music-170bpm";
import { Constructable } from "types";
import { UI } from "ui";
import { autorun } from "mobx";

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
    @inject private ui: UI;

    private musicSpeed?: MusicSpeed;
    private timeStarted = 0;
    private currentMusic?: { gain: GainNode, source: AudioBufferSourceNode };
    private musicNode: GainNode;
    private soundsNode: GainNode;
    private filterNode: BiquadFilterNode;

    public get musicAudio() {
        if (typeof this.musicSpeed !== "number") { return; }
        return this.audioManager.audio(musicForSpeed(this.musicSpeed));
    }

    @initialize protected initialize() {
        this.timeStarted = this.audioContext.currentTime;

        this.filterNode = this.audioContext.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.connect(this.audioContext.destination);

        this.musicNode = this.audioContext.createGain();
        this.musicNode.connect(this.filterNode);

        this.soundsNode = this.audioContext.createGain();
        this.soundsNode.connect(this.filterNode);

        autorun(() => {
            this.soundsNode.gain.value = this.ui.volumeSounds;
            this.musicNode.gain.value = this.ui.volumeMusic;
        });

        this.changeMusicSpeed(MusicSpeed.BPM_120);
    }

    public play(audioClass: Constructable<Audio>) {
        const audio = this.audioManager.audio(audioClass);
        const { gain, source } = audio.createSource();
        gain.connect(this.soundsNode);
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

    public startMenu() {
        this.filterNode.frequency.value = 2000;
    }

    public startGame() {
        this.filterNode.frequency.value = 30000;
    }

    public changeMusicSpeed(speed: MusicSpeed) {
        if (speed === this.musicSpeed) { return; }
        const { relativeMusicPosition } = this;
        this.stopMusic();
        this.musicSpeed = speed;
        const music = this.musicAudio!.createSource();
        const { gain, source } = music;
        this.currentMusic = music;
        gain.connect(this.musicNode);
        source.loop = true;
        source.start(0, relativeMusicPosition ? this.musicAudio!.duration * relativeMusicPosition : 0);
        this.timeStarted = this.audioContext.currentTime;
    }
}
