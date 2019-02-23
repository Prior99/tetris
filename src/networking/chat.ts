import { component } from "tsdi";
import { ChatMessage } from "./messages";

@component
export class Chat {
    public messages: ChatMessage[] = [];

    public add(message: ChatMessage) {
        this.messages.push(message);
    }
}
