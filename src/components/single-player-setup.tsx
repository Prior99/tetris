import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Networking } from "networking";
import { ObservableGame } from "observable-game";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Page, NetworkingMode } from "types";
import * as css from "./single-player-setup.scss";
import { ChatMessage } from "./chat-message";
import { Configure } from "./configure";

@external @observer
export class SinglePlayerSetup extends React.Component {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private networking: Networking;

    @bind private handleBack() { this.ui.page = Page.MENU; }

    @bind private handleStart() {
        this.observableGame.start(this.ui.parameters);
        this.ui.page = Page.SINGLE_PLAYER;
    }

    public render() {
        return (
            <section className={css.singlePlayerSetup}>
                <div className={css.wrapper}>
                    <h1>Start Game</h1>
                    <div className={css.content}>
                        <Configure
                            onChange={parameters => this.ui.parameters = parameters}
                            parameters={this.ui.parameters}
                            enabled={true}
                            singleplayer
                        />
                        <button style={{ width: "100%" }} onClick={this.handleStart}>Start</button>
                        <a onClick={this.handleBack}>Back</a>
                    </div>
                </div>
            </section>
        );
    }
}
