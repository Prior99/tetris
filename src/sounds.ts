import { component, inject, initialize } from "tsdi";
import { AudioManager, Audio, AudioMusic140Bpm } from "resources";
import { SoundsMode, Constructable } from "types";
import { UI } from "ui";
import { autorun } from "mobx";

@component
export class Sounds {
    @inject private audioManager: AudioManager;
    @inject("AudioContext") private audioContext: AudioContext;
    @inject private ui: UI;

    private currentMusic?: { gain: GainNode, source: AudioBufferSourceNode };
    private musicNode: GainNode;
    private soundsNode: GainNode;
    private filterNode: BiquadFilterNode;

    private get musicAudio() {
        return this.audioManager.audio(AudioMusic140Bpm);
    }

    @initialize protected initialize() {
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

        const music = this.musicAudio!.createSource();
        const { gain, source } = music;
        this.currentMusic = music;
        gain.connect(this.musicNode);
        source.loop = true;
        source.start();
    }

    public play(audioClass: Constructable<Audio>) {
        const audio = this.audioManager.audio(audioClass);
        const { gain, source } = audio.createSource();
        gain.connect(this.soundsNode);
        source.start();
    }

    public stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.source.stop();
            this.currentMusic.source.disconnect();
            this.currentMusic.gain.disconnect();
        }
    }

    public setMode(mode: SoundsMode) {
        if (mode === SoundsMode.GAME) {
            this.filterNode.frequency.value = 30000;
        } else {
            this.filterNode.frequency.value = 1000;
        }
    }
}
