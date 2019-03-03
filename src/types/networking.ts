export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

export interface RemoteGameState {
    score: number;
    lines: number;
    level: number;
    toppedOut: boolean;
}

export interface RemoteUser {
    name: string;
    id: string;
}

export interface ChatMessage {
    text: string;
    userId: string;
    date: Date;
}
