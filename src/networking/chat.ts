import { component } from "tsdi";
import { observable } from "mobx";
import { ChatMessage } from "./messages";

@component
export class Chat {
    @observable public messages: ChatMessage[] = [];

    public add(message: ChatMessage) {
        this.messages.push(message);
    }
}
