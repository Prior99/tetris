import * as React from "react";
import { Networking } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { History } from "history";
import { Segment } from "semantic-ui-react";
import { bind } from "lodash-decorators";
import { GameOver } from "components/game-over";
import { ObservableGame } from "observable-game";
import { NetworkingMode } from "types";
import { UI } from "ui";
import { TabMenu } from "../tab-menu";
import { MenuContainer } from "../menu-container";
import { PauseMenu } from "../pause-menu";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { Info } from "../info";
import { RemoteGame } from "../remote-game";
import * as css from "./multi-player.scss";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject("History") private history: History;

    @initialize protected initialize() {
        if (this.networking.mode === NetworkingMode.DISCONNECTED) {
            this.history.replace("/main-menu");
        }
    }

    public componentDidMount() {
        window.addEventListener("keydown", this.keyDown);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.keyDown);
    }

    @bind private keyDown(evt: KeyboardEvent) {
        if (evt.key !== "Escape") { return; }
        this.networking.pause();
    }

    @bind private exit() {
        this.networking.close();
        this.ui.leaderboardSubmitted = false;
        this.history.push("/");
    }

    public render() {
        if (this.networking.mode === NetworkingMode.DISCONNECTED) { return <></>; }
        return (
            <>
                <MenuContainer>
                    <section className={css.multiPlayer}>
                        <div className={css.wrapper}>
                            <Info />
                            <Segment style={{ margin: 0 }}>
                                <GameCanvas><GameOver multiPlayer /></GameCanvas>
                            </Segment>
                            <TetriminoPreviews />
                        </div>
                        <div className={css.others}>
                            {
                                this.networking.allUsers
                                    .filter(user => user.id !== this.networking.ownId)
                                    .map(user => <RemoteGame key={user.id} userId={user.id} />)
                            }
                        </div>
                    </section>
                </MenuContainer>
                <TabMenu />
                <PauseMenu
                    open={this.observableGame.paused}
                    onResume={this.networking.unpause}
                    onResign={this.exit}
                />
            </>
        );
    }
}
