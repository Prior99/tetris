import { component } from "tsdi";
import { Sprite } from "./sprite";

export type Constructable<T> = new() => T;

@component
export class SpriteManager {
    private sprites = new Map<Constructable<Sprite>, Sprite>();

    public async load(SpriteClass: Constructable<Sprite>) {
        try {
            const sprite = new SpriteClass();
            await sprite.load();
            this.sprites.set(SpriteClass, sprite);
        } catch (err) {
            throw err;
        }
    }

    public sprite<T extends Sprite>(clazz: Constructable<T>): T {
        if (!clazz) { throw new Error("Attempted to load undefined sprite."); }
        if (!this.sprites.has(clazz)) {
            throw new Error(`Attempted to get sprite which was not loaded: ${clazz.name}`);
        }
        return this.sprites.get(clazz)! as T;
    }
}
