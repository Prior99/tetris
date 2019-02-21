import { component } from "tsdi";
import { Sprite } from "./sprite";

type Constructable<T> = new() => T;

@component
export class SpriteManager {
    private sprites = new Map<Constructable<Sprite>, Sprite>();

    public async load(sprite: Sprite) {
        return;
    }

    public sprite<T extends Sprite>(clazz: Constructable<T>): T | undefined {
        return this.sprites.get(clazz) as T;
    }
}
