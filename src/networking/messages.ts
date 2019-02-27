export enum MessageType {
    HELLO,
    START,
    WELCOME,
    USER_CONNECTED,
    USER_DISCONNECTED,
    CHAT_MESSAGE,
    UPDATE_PLAYFIELD,
    TOP_OUT,
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

export interface MessageHello {
    message: MessageType.HELLO;
    user: RemoteUser;
}

export interface MessageStart {
    message: MessageType.START;
    seed: string;
}

export interface MessageWelcome {
    message: MessageType.WELCOME;
    users: RemoteUser[];
}

export interface MessageUserConnected {
    message: MessageType.USER_CONNECTED;
    user: RemoteUser;
}

export interface MessageUserDisconnected {
    message: MessageType.USER_CONNECTED;
    userId: string;
}

export interface MessageUpdatePlayfield {
    message: MessageType.UPDATE_PLAYFIELD;
    userId: string;
    matrix: string;
}

export interface MessageTopOut {
    message: MessageType.TOP_OUT;
    userId: string;
}

export interface MessageChatMessage {
    message: MessageType.CHAT_MESSAGE;
    chatMessage: ChatMessage;
}

export type Message = MessageHello |
    MessageStart |
    MessageWelcome |
    MessageUserConnected |
    MessageUpdatePlayfield |
    MessageChatMessage |
    MessageTopOut;
