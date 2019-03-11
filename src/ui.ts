import { component, initialize } from "tsdi";
import { generateName, randomSeed } from "utils";
import { observable } from "mobx";
import { Page, Settings, GameParameters, GarbageMode, GameMode, WinningConditionType } from "types";

const localStorageIdentifier = "FRETRIS";
const localStorageVersion = 1;

@component
export class UI {
    @observable private volume = { music: 0.5, sounds: 0.6 };
    @observable private userName = generateName();
    @observable public page = Page.MENU;
    @observable public leaderboardSubmitted = false;
    @observable public parameters: GameParameters = {
        seed: randomSeed(),
        garbageMode: GarbageMode.NONE,
        gameMode: GameMode.SINGLE_PLAYER,
        initialGarbageLines: 0,
        initialLevel: 0,
        levelUpDisabled: false,
        winningCondition: { condition: WinningConditionType.HIGHEST_SCORE_ONE_GAME },
    };

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

    public reset() {
        this.leaderboardSubmitted = false;
        this.parameters.seed = randomSeed();
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
