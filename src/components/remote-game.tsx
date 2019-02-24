import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ChatMessage as ChatMessageInterface, Chat, RemoteUsers, NetworkGame } from "networking";
import { OtherGameCanvas } from "./other-game-canvas";
import * as css from "./remote-game.scss";

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private users: RemoteUsers;
    @inject private networkGame: NetworkGame;

    public render() {
        return (
            <OtherGameCanvas matrix={this.networkGame.byUser(this.props.userId)!} />
        );
    }
}
