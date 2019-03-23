import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ChatMessage as ChatMessageInterface } from "types";
import { Networking } from "networking";
import { Comment } from "semantic-ui-react";

@external @observer
export class ChatMessage extends React.Component<{ message: ChatMessageInterface }> {
    @inject private networking: Networking;

    public render() {
        const { message } = this.props;
        const { text, date } = message;
        return (
            <Comment>
                <Comment.Content>
                    <Comment.Author style={{ display: "inline-block" }}>
                        {this.networking.userById(this.props.message.userId)!.name}
                    </Comment.Author>
                    <Comment.Metadata>{date.toLocaleTimeString()}</Comment.Metadata>
                    <Comment.Text>{text}</Comment.Text>
                </Comment.Content>
            </Comment>
        );
    }
}
