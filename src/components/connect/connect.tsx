import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Networking } from "networking";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Page } from "types";
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
        this.ui.name = evt.currentTarget.value;
    }

    @bind private handleOtherIdChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.otherId = evt.currentTarget.value;
    }

    @bind private async handleHost() {
        await this.networking.host(this.ui.name);
        this.ui.page = Page.LOBBY;
    }

    @bind private async handleConnect() {
        await this.networking.client(this.otherId, this.ui.name);
        this.ui.page = Page.LOBBY;
    }

    public render() {
        return (
            <section className={css.connect}>
                <div className={css.wrapper}>
                    <h1>Connect</h1>
                    <div className={css.content}>
                        <p className={css.inputFullWidth}>
                            Change name
                        </p>
                        <p className={css.inputFullWidth}>
                            <input
                                className={css.inputFullWidth}
                                value={this.ui.name}
                                onChange={this.handleNameChange}
                            />
                        </p>
                        <p>Join</p>
                        <p className={css.inputFullWidth}>
                            <input value={this.otherId} onChange={this.handleOtherIdChange} />
                            <button onClick={this.handleConnect}>Join</button>
                        </p>
                        <p>Host</p>
                        <p><button style={{ width: "100%" }} onClick={this.handleHost}>Host</button></p>
                        <a onClick={this.handleBack}>Back</a>
                    </div>
                </div>
            </section>
        );
    }
}
