import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { RemoteUsers, Networking, NetworkingMode } from "networking";
import { bind } from "lodash-decorators";
import { UI, Page } from "ui";
import * as css from "./lobby.scss";

@external @observer
export class Lobby extends React.Component {
    @inject private ui: UI;
    @inject private networking: Networking;
    @inject private users: RemoteUsers;

    @bind private handleBack() {
        this.ui.page = Page.MENU;
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
                    <a onClick={this.handleBack}>Back</a>
                </div>
            </section>
        );
    }
}
