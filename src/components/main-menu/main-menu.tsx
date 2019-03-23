import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { History } from "history";
import { observer } from "mobx-react";
import { Menu, Segment } from "semantic-ui-react";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Page, SoundsMode } from "types";
import { Sounds } from "sounds";
import { MenuContainer } from "../menu-container";
import * as css from "./main-menu.scss";

declare const SOFTWARE_VERSION: string;

@external @observer
export class MainMenu extends React.Component {
    @inject("History") private history: History;
    @inject private ui: UI;
    @inject private sounds: Sounds;

    @initialize protected initialize() {
        this.sounds.setMode(SoundsMode.MENU);
    }

    @bind private handleSinglePlayer() {
        this.history.push("/single-player-setup");
    }

    @bind private handleSettings() {
        this.history.push("/settings");
    }

    @bind private handleMultiplayer() {
        this.history.push("/connect");
    }

    @bind private handleLeaderboard() {
        this.history.push("/leaderboard");
    }

    public render() {
        return (
            <MenuContainer>
                <Segment>
                    <h1>Fretris</h1>
                    <Menu secondary fluid vertical>
                        <Menu.Item onClick={this.handleSinglePlayer}>Singleplayer</Menu.Item>
                        <Menu.Item onClick={this.handleSettings}>Settings</Menu.Item>
                        <Menu.Item onClick={this.handleMultiplayer}>Multiplayer</Menu.Item>
                        <Menu.Item onClick={this.handleLeaderboard}>Leaderboard</Menu.Item>
                    </Menu>
                    <p className={css.version}>version {SOFTWARE_VERSION}</p>
                </Segment>
            </MenuContainer>
        );
    }
}
