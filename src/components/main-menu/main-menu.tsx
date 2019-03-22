import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { Menu, Segment } from "semantic-ui-react";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Page, SoundsMode } from "types";
import { Sounds } from "sounds";
import * as css from "./main-menu.scss";

declare const SOFTWARE_VERSION: string;

@external @observer
export class MainMenu extends React.Component {
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
                <Segment raised>
                    <h1>Fretris</h1>
                    <Menu vertical secondary>
                        <Menu.Item onClick={this.handleSinglePlayer}>Singleplayer</Menu.Item>
                        <Menu.Item onClick={this.handleSettings}>Settings</Menu.Item>
                        <Menu.Item onClick={this.handleMultiplayer}>Multiplayer</Menu.Item>
                        <Menu.Item onClick={this.handleLeaderboard}>Leaderboard</Menu.Item>
                    </Menu>
                    <p className={css.version}>version {SOFTWARE_VERSION}</p>
                </Segment>
            </section>
        );
    }
}
