import { component, initialize, inject } from "tsdi";
import { without } from "ramda";
import { observable } from "mobx";
import { SpriteManager, Sprite } from "./sprites";
import { AudioManager, Audio } from "./audio";
import * as sprites from "./sprites";
import * as audios from "./audio";
import { Constructable } from "types";
import { Config } from "config";

export const allSprites: { name: string, sprite: Constructable<Sprite> }[] =
    without(["ImageManager", "SpriteFloor", "SpriteManager", "Sprite", "TintedSprite"], Object.keys(sprites))
    .map(name => ({ name, sprite: sprites[name] }));

const allAudios: Constructable<Audio>[] =
    without(["AudioManager", "Audio", "Sounds", "musicSpeedForLevel", "MusicSpeed"], Object.keys(audios))
    .map(key => audios[key]);

export enum LoadStatus {
    PENDING = "pending",
    IN_PROGRESS = "in-progress",
    DONE = "done",
}

@component
export class Loader {
    @inject private sprites: SpriteManager;
    @inject private audios: AudioManager;
    @inject private config: Config;

    @observable public resources: { status: LoadStatus, promise: Promise<any> }[] = [];

    public queue(promise: Promise<any>) {
        this.resources.push({
            status: LoadStatus.PENDING,
            promise,
        });
    }

    @initialize protected async initialize() {
        allSprites.forEach((sprite, index) => this.queue(this.sprites.load(sprite.sprite)));
        allAudios.forEach((audio, index) => this.queue(this.audios.load(audio)));
        await this.loadAll();
    }

    public async loadAll() {
        const notLoaded = this.resources.filter(({ status }) => status !== LoadStatus.DONE);
        for (let i = 0; i < notLoaded.length; i += this.config.loadStride) {
            const slice = notLoaded.slice(i, i + this.config.loadStride);
            slice.forEach(resource => resource.status = LoadStatus.IN_PROGRESS);
            await Promise.all(slice.map(({ promise }) => promise));
            slice.forEach(resource => resource.status = LoadStatus.DONE);
        }
    }

    public get done() {
        return this.resources.length > 0 && this.resources.every(({ status }) => status === LoadStatus.DONE);
    }
}
