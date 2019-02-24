import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Networking } from "networking";
import { bind } from "lodash-decorators";
import { UI, Page } from "ui";
import * as css from "./connect.scss";

@external @observer
export class Connect extends React.Component {
    @inject private ui: UI;
    @inject private networking: Networking;

    @observable public otherId = "";

    @bind private handleBack() {
        this.ui.page = Page.MENU;
    }

    @bind private handleNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.networking.name = evt.currentTarget.value;
    }

    @bind private handleOtherIdChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.otherId = evt.currentTarget.value;
    }

    @bind private handleHost() {
        this.ui.page = Page.LOBBY;
        this.networking.host();
    }

    @bind private handleConnect() {
        this.ui.page = Page.LOBBY;
        this.networking.connect(this.otherId);
    }

    public render() {
        return (
            <section className={css.connect}>
                <div className={css.wrapper}>
                    <h1>Connect</h1>
                    <p>Change name: <input value={this.networking.name} onChange={this.handleNameChange} /></p>
                    <p>
                        Join: <input value={this.otherId} onChange={this.handleOtherIdChange} />
                        <button onClick={this.handleConnect}>Join</button>
                    </p>
                    <p><button style={{ width: "100%" }} onClick={this.handleHost}>Host</button></p>
                    <a onClick={this.handleBack}>Back</a>
                </div>
            </section>
        );
    }
}
