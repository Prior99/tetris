import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Chat, RemoteUsers, Networking, NetworkingMode } from "networking";
import { bind } from "lodash-decorators";
import { UI, Page } from "ui";
import * as css from "./lobby.scss";
import { ChatMessage } from "./chat-message";

@external @observer
export class Lobby extends React.Component {
    @inject private ui: UI;
    @inject private chat: Chat;
    @inject private networking: Networking;
    @inject private users: RemoteUsers;

    @observable private chatText = "";

    @bind private handleBack() { this.ui.page = Page.MENU; }

    @bind private handleChatTextChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.chatText = evt.currentTarget.value;
    }

    @bind private handleChatSend() {
        this.networking.sendChatMessage(this.chatText);
        this.chatText = "";
    }

    public render() {
        return (
            <section className={css.lobby}>
                <div className={css.wrapper}>
                    <h1>Lobby</h1>
                    {
                        this.networking.mode === NetworkingMode.CLIENT
                            ?  <p>Connected to <b>{this.networking.remoteId}</b></p>
                            :  <p>Hosting as <b>{this.networking.id}</b></p>
                    }
                    <p>Users</p>
                    <ul>
                        {this.users.all.map(user => <li key={user.id}>{user.name}</li>)}
                    </ul>
                    <p>Chat</p>
                    <ul className={css.chat}>
                        {this.chat.messages.map((message, index) => <ChatMessage key={index} message={message} />)}
                    </ul>
                    <p>
                        <input value={this.chatText} onChange={this.handleChatTextChange} />
                        <button onClick={this.handleChatSend}>Send</button>
                    </p>
                    <a onClick={this.handleBack}>Back</a>
                </div>
            </section>
        );
    }
}
