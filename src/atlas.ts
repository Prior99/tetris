export interface Offset {
    x: number;
    y: number;
}

export interface Dimensions {
    w: number;
    h: number;
}

export interface Rect extends Offset, Dimensions {
}

export interface Atlas {
    frames: {
        filename: string;
        frame: Rect;
        rotated: boolean;
        trimmed: boolean;
        spriteSourceSize: Rect;
        sourceSize: Dimensions;
        duration: number;
    }[];
    meta: {
        app: string;
        version: string;
        image: string;
        size: Dimensions;
        scale: string;
        format: string;
    };
}
