import { readFile } from "fs";
import { component } from "tsdi";
import { Image } from "canvas";

@component
export class ImageManager {
    private images = new Map<string, HTMLImageElement>();
    private handlers = new Map<string, { resolve(image: HTMLImageElement): void, reject(reason: any): void }[]>();
    private failed = new Set<string>();

    public load(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.failed.has(url)) {
                reject(new Error("Image failed to load earlier."));
            }
            if (this.handlers.has(url)) {
                this.handlers.get(url)!.push({ resolve, reject });
                return;
            }
            this.handlers.set(url, [{ resolve, reject }]);
            const image = new Image();
            image.onload = () => {
                this.handlers.get(url)!.forEach(({ resolve: resolveHandler }) => resolveHandler(image));
                this.images.set(url, image);
                this.handlers.delete(url);
            };
            image.onerror = err => {
                this.handlers.get(url)!.forEach(({ reject: rejectHandler }) => rejectHandler(err));
                this.failed.add(url);
                this.handlers.delete(url);
            };
            readFile(`./${url}`, (err, png) => {
                if (err) {
                    reject(new Error(`Unable to read file ${url}.`));
                }
                image.src = png as any;
            });
        });
    }

    public image(url: string): HTMLImageElement {
        if (!this.images.has(url)) { throw new Error(`Attempted to get image which was not loaded: ${url}`); }
        return this.images.get(url)!;
    }
}
