import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ChatMessage as ChatMessageInterface } from "types";
import { Networking } from "networking";
import * as css from "./chat-message.scss";

@external @observer
export class ChatMessage extends React.Component<{ message: ChatMessageInterface }> {
    @inject private networking: Networking;

    public render() {
        return (
            <li className={css.chatMessage}>
                <b>{this.networking.userById(this.props.message.userId)!.name}</b> {this.props.message.text}
            </li>
        );
    }
}
