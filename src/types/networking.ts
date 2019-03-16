import { GameOverReason } from "types";

export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

export interface RemoteGameState {
    score: number;
    lines: number;
    level: number;
    gameOverReason: GameOverReason;
    timeGameOver: number | undefined;
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
