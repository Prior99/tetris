import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Networking } from "networking";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Page, NetworkingMode } from "types";
import * as css from "./lobby.scss";
import { ChatMessage } from "../chat-message";
import { Configure } from "../configure";

@external @observer
export class Lobby extends React.Component {
    @inject private ui: UI;
    @inject private networking: Networking;

    @observable private chatText = "";

    @bind private handleBack() { this.ui.page = Page.MENU; }

    @bind private handleChatTextChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.chatText = evt.currentTarget.value;
    }

    @bind private handleChatSend() {
        this.networking.sendChatMessage(this.chatText);
        this.chatText = "";
    }

    @bind private handleStart() {
        this.networking.sendStartGame();
    }

    public render() {
        return (
            <section className={css.lobby}>
                <div className={css.outer}>
                    <div className={css.leftColumn}>
                        <div className={css.wrapper}>
                            <h1>Lobby</h1>
                            <div className={css.content}>
                                <div className={css.id}>
                                    {this.networking.hostId}
                                </div>
                                <Configure
                                    onChange={parameters => this.networking.changeParameters(parameters)}
                                    parameters={this.networking.parameters}
                                    enabled={this.networking.mode === NetworkingMode.HOST}
                                />
                                {
                                    this.networking.mode === NetworkingMode.HOST ? (
                                        <button style={{ width: "100%" }} onClick={this.handleStart}>Start</button>
                                    ) : <></>
                                }
                                <a onClick={this.handleBack}>Back</a>
                            </div>
                        </div>
                        <div className={css.wrapper}>
                            <h1>Users</h1>
                            <div className={css.content}>
                                <ul className={css.users}>
                                    {this.networking.allUsers.map(user => <li key={user.id}>{user.name}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={css.rightColumn}>
                        <div className={css.wrapper}>
                            <h1>Chat</h1>
                            <div className={css.content}>
                                <ul className={css.chat}>
                                    <li>Your chat history starts here.</li>
                                    {
                                        this.networking.chatMessages.map((message, index) => {
                                            return <ChatMessage key={index} message={message} />;
                                        })
                                    }
                                </ul>
                                <p className={css.inputFullWidth}>
                                    <input value={this.chatText} onChange={this.handleChatTextChange} />
                                    <button onClick={this.handleChatSend}>Send</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
