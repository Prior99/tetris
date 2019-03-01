import { component, initialize } from "tsdi";
import { generateName } from "names";
import { observable } from "mobx";

const localStorageIdentifier = "FRETRIS";
const localStorageVersion = 1;

interface Settings {
    volumeMusic: number;
    volumeSounds: number;
    version: number;
    name: string;
}

export enum Page {
    MENU = "menu",
    SETTINGS = "setting",
    SINGLE_PLAYER = "single-player",
    LOBBY = "lobby",
    CONNECT = "connect",
    MULTI_PLAYER = "multi-player",
    LEADERBOARD = "leaderboard",
}

export enum GameMode {
    SINGLE_PLAYER = "single-player",
    MULTI_PLAYER = "multi-player",
}

@component
export class UI {
    @observable private volume = { music: 0.5, sounds: 0.6 };
    @observable private userName = generateName();
    @observable public page = Page.MENU;
    @observable public gameMode: GameMode;

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
                if (settings.name) {
                    this.name = settings.name;
                }
            }
        } catch (err) {
            console.error(`Failed to parse settings: ${json}`);
            localStorage.removeItem(localStorageIdentifier);
        }
    }

    get name() {
        return this.userName;
    }

    set name(name: string) {
        this.userName = name;
        this.save();
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
        const { volumeMusic, volumeSounds, name } = this;
        const json = JSON.stringify({
            volumeMusic,
            volumeSounds,
            name,
            version: localStorageVersion,
        });
        localStorage.setItem(localStorageIdentifier, json);
    }
}
