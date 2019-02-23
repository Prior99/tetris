import { component, initialize } from "tsdi";
import { observable } from "mobx";

const localStorageIdentifier = "FRETRIS";
const localStorageVersion = 1;

interface Settings {
    volumeMusic: number;
    volumeSounds: number;
    version: number;
}

export enum Page {
    MENU = "menu",
    SETTINGS = "setting",
    SINGLE_PLAYER = "single-player",
}

@component
export class UI {
    @observable private volume = { music: 0, sounds: 0 };
    @observable public page = Page.MENU;

    @initialize protected initialize() {
        const json = localStorage.getItem(localStorageIdentifier);
        if (!json) { return; }
        try {
            const settings: Settings = JSON.parse(json);
            if (settings.version !== localStorageVersion) {
                console.error("Outdated settings encountered.");
                localStorage.removeItem(localStorageIdentifier);
            } else {
                this.volume = {
                    music: settings.volumeMusic,
                    sounds: settings.volumeSounds,
                };
            }
        } catch (err) {
            console.error(`Failed to parse settings: ${json}`);
            localStorage.removeItem(localStorageIdentifier);
        }
    }

    get volumeSounds() {
        return this.volume.sounds;
    }

    set volumeSounds(volume: number) {
        this.volume.sounds = volume;
        this.save();
    }

    get volumeMusic() {
        return this.volume.music;
    }

    set volumeMusic(volume: number) {
        this.volume.music = volume;
        this.save();
    }

    private save() {
        const { volumeMusic, volumeSounds } = this;
        const json = JSON.stringify({
            volumeMusic,
            volumeSounds,
            version: localStorageVersion,
        });
        localStorage.setItem(localStorageIdentifier, json);
    }
}
