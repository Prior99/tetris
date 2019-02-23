import { component, initialize, inject } from "tsdi";
import { observable } from "mobx";
import { Sprite } from "./sprite";
import { Audio } from "./audio";
import { SpriteManager } from "./sprite-manager";
import { AudioManager } from "./audio-manager";
import * as sprites from "./sprites";
import * as audios from "./audios";
import { Constructable } from "./constructable";
import { Config } from "./config";

const allSprites: Constructable<Sprite>[] = Object.keys(sprites).map(key => sprites[key]);
const allAudios: Constructable<Audio>[] = Object.keys(audios).map(key => audios[key]);

export enum LoadStatus {
    PENDING = "pending",
    IN_PROGRESS = "in progress",
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
        allSprites.forEach((sprite, index) => this.queue(this.sprites.load(sprite)));
        allAudios.forEach((audio, index) => this.queue(this.audios.load(audio)));
        for (let i = 0; i < this.resources.length; i += this.config.loadStride) {
            const slice = this.resources.slice(i, i + this.config.loadStride);
            slice.forEach(resource => resource.status = LoadStatus.IN_PROGRESS);
            await Promise.all(slice.map(({ promise }) => promise));
            slice.forEach(resource => resource.status = LoadStatus.DONE);
        }
    }

    public get done() {
        return this.resources.length > 0 && this.resources.every(({ status }) => status === LoadStatus.DONE);
    }
}
