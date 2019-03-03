import { observable } from "mobx";
import { ChatMessage } from "types";

export class Chat {
    @observable public messages: ChatMessage[] = [];

    public add(message: ChatMessage) {
        this.messages.push(message);
    }
}
