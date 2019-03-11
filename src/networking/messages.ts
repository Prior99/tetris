import { GameParameters, Garbage, RemoteUser, RemoteGameState, ChatMessage } from "types";

export enum MessageType {
    HELLO,
    START,
    WELCOME,
    USER_CONNECTED,
    USER_DISCONNECTED,
    CHAT_MESSAGE,
    UPDATE_PLAYFIELD,
    RESTART,
    GARBAGE,
    PARAMETERS_CHANGE,
}

export interface MessageHello {
    message: MessageType.HELLO;
    user: RemoteUser;
}

export interface MessageParametersChange {
    message: MessageType.PARAMETERS_CHANGE;
    parameters: GameParameters;
}

export interface MessageStart {
    message: MessageType.START;
    parameters: GameParameters;
}

export interface MessageWelcome {
    message: MessageType.WELCOME;
    users: RemoteUser[];
    parameters: GameParameters;
}

export interface MessageUserConnected {
    message: MessageType.USER_CONNECTED;
    user: RemoteUser;
}

export interface MessageUserDisconnected {
    message: MessageType.USER_CONNECTED;
    userId: string;
}

export interface MessageGarbage {
    message: MessageType.GARBAGE;
    garbage: Garbage;
    targetId: string;
}

export interface MessageRestart {
    message: MessageType.RESTART;
    seed: string;
}

export interface MessageChatMessage {
    message: MessageType.CHAT_MESSAGE;
    chatMessage: ChatMessage;
}

export interface MessageUpdatePlayfield {
    message: MessageType.UPDATE_PLAYFIELD;
    userId: string;
    matrix: string;
    state: RemoteGameState;
}

export type Message = MessageHello |
    MessageStart |
    MessageWelcome |
    MessageUserConnected |
    MessageUpdatePlayfield |
    MessageChatMessage |
    MessageRestart |
    MessageGarbage |
    MessageParametersChange;
