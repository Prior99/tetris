import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ChatMessage as ChatMessageInterface, Chat, RemoteUsers } from "networking";
import * as css from "./chat-message.scss";

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private users: RemoteUsers;

    public render() {
        return (
        <p>{this.props.userId}</p>
        );
    }
}
