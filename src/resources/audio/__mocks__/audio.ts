export class Audio {
    public createSource() {
        return {
            source: {
                connect: jest.fn(),
            },
            gain: {
                connect: jest.fn(),
            },
        };
    }

    public get duration() { return 0; }

    public async load() {
        return;
    }
}
