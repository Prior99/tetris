import { component } from "tsdi";

@component
export class ImageManager {
    private static images = new Map<string, HTMLImageElement>();
    private handlers = new Map<string, { resolve(image: HTMLImageElement): void, reject(reason: any): void }[]>();
    private static failed = new Set<string>();

    public load(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (ImageManager.failed.has(url)) {
                reject(new Error("Image failed to load earlier."));
            }
            if (this.handlers.has(url)) {
                this.handlers.get(url)!.push({ resolve, reject });
                return;
            }
            this.handlers.set(url, [{ resolve, reject }]);
            const image = new Image();
            image.addEventListener("load", () => {
                this.handlers.get(url)!.forEach(({ resolve: resolveHandler }) => resolveHandler(image));
                ImageManager.images.set(url, image);
                this.handlers.delete(url);
            });
            image.addEventListener("error", err => {
                this.handlers.get(url)!.forEach(({ reject: rejectHandler }) => rejectHandler(err));
                ImageManager.failed.add(url);
                this.handlers.delete(url);
            });
            image.src = url;
        });
    }

    public image(url: string): HTMLImageElement {
        if (!ImageManager.images.has(url)) { throw new Error(`Attempted to get image which was not loaded: ${url}`); }
        return ImageManager.images.get(url)!;
    }
}
