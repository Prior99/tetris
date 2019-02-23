export enum MessageType {
    HELLO,
    START,
    WELCOME,
    USER_CONNECTED,
    USER_DISCONNECTED,
    INPUT_LEFT,
    INPUT_RIGHT,
    INPUT_ROTATE_LEFT,
    INPUT_ROTATE_RIGHT,
    INPUT_SOFT_DROP,
    INPUT_HARD_DROP,
    CHAT_MESSAGE,
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

export interface MessageInputLeft {
    message: MessageType.INPUT_LEFT;
    userId: string;
}

export interface MessageInputRight {
    message: MessageType.INPUT_RIGHT;
    userId: string;
}

export interface MessageInputRotateRight {
    message: MessageType.INPUT_ROTATE_RIGHT;
    userId: string;
}

export interface MessageInputRotateRight {
    message: MessageType.INPUT_ROTATE_RIGHT;
    userId: string;
}

export interface MessageInputHardDrop {
    message: MessageType.INPUT_HARD_DROP;
    userId: string;
}

export interface MessageInputSoftDrop {
    message: MessageType.INPUT_SOFT_DROP;
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
    MessageInputLeft |
    MessageInputRight |
    MessageInputRotateRight |
    MessageInputRotateRight |
    MessageInputHardDrop |
    MessageInputSoftDrop |
    MessageChatMessage;
