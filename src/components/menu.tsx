import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { UI, Page } from "ui";
import { bind } from "lodash-decorators";
import * as css from "./menu.scss";
import { Sounds } from "audio";

@external @observer
export class Menu extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;

    @initialize protected initialize() {
        this.sounds.startMenu();
    }

    @bind private handleSinglePlayer() {
        this.ui.page = Page.SINGLE_PLAYER;
    }

    @bind private handleSettings() {
        this.ui.page = Page.SETTINGS;
    }

    @bind private handleMultiplayer() {
        this.ui.page = Page.CONNECT;
    }

    public render() {
        return (
            <section className={css.menu}>
                <div className={css.wrapper}>
                    <h1>Fretris</h1>
                    <div className={css.content}>
                        <ul>
                            <li><a onClick={this.handleSinglePlayer}>Singleplayer</a></li>
                            <li><a onClick={this.handleSettings}>Settings</a></li>
                            <li><a onClick={this.handleMultiplayer}>Multiplayer</a></li>
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}
