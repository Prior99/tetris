import * as React from "react";
import { Networking } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { Info } from "../info";
import { RemoteGame } from "../remote-game";
import * as css from "./multi-player.scss";
import { GameOver } from "components/game-over";
import { Segment } from "semantic-ui-react";
import { MenuContainer } from "components/menu-container";
import { NetworkingMode } from "types";
import { History } from "history";
import { TabMenu } from "components/tab-menu/tab-menu";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject("History") private history: History;

    @initialize protected initialize() {
        if (this.networking.mode === NetworkingMode.DISCONNECTED) {
            this.history.replace("/main-menu");
        }
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
            </>
        );
    }
}
