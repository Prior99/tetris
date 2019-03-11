import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { UI } from "ui";
import { Page, SoundsMode } from "types";
import { bind } from "lodash-decorators";
import * as css from "./menu.scss";
import { Sounds } from "sounds";

declare const SOFTWARE_VERSION: string;

@external @observer
export class Menu extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;

    @initialize protected initialize() {
        this.sounds.setMode(SoundsMode.MENU);
    }

    @bind private handleSinglePlayer() {
        this.ui.page = Page.SINGLE_PLAYER_SETUP;
    }

    @bind private handleSettings() {
        this.ui.page = Page.SETTINGS;
    }

    @bind private handleMultiplayer() {
        this.ui.page = Page.CONNECT;
    }

    @bind private handleLeaderboard() {
        this.ui.page = Page.LEADERBOARD;
    }

    public render() {
        return (
            <section className={css.menu}>
                <div className={css.wrapper}>
                    <h1>Fretris <span className={css.version}>version {SOFTWARE_VERSION}</span></h1>
                    <div className={css.content}>
                        <ul>
                            <li><a onClick={this.handleSinglePlayer}>Singleplayer</a></li>
                            <li><a onClick={this.handleSettings}>Settings</a></li>
                            <li><a onClick={this.handleMultiplayer}>Multiplayer</a></li>
                            <li><a onClick={this.handleLeaderboard}>Leaderboard</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}
