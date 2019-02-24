import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ChatMessage as ChatMessageInterface, RemoteUsers } from "networking";
import * as css from "./chat-message.scss";

@external @observer
export class ChatMessage extends React.Component<{ message: ChatMessageInterface }> {
    @inject private users: RemoteUsers;

    public render() {
        return (
            <li className={css.chatMessage}>
                <b>{this.users.byId(this.props.message.userId)!.name}</b> {this.props.message.text}
            </li>
        );
    }
}
