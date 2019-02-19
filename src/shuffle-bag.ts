export class ShuffleBag<T> {
    constructor(public options: T[] = []) {}

    public take() {
        return this.options[Math.floor(Math.random() * this.options.length)];
    }

    public add(option: T) {
        this.options.push(option);
    }
}
