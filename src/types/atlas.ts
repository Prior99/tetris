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

export interface Frame {
    filename: string;
    frame: Rect;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: Rect;
    sourceSize: Dimensions;
    duration: number;
}

export interface Atlas {
    frames: Frame[];
    meta: {
        app: string;
        version: string;
        image: string;
        size: Dimensions;
        scale: string;
        format: string;
    };
}
