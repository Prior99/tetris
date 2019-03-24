import * as React from "react";
import { Networking } from "networking";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { Info } from "../info";
import { RemoteGame } from "../remote-game";
import { Scoreboard } from "../scoreboard";
import * as css from "./multi-player.scss";
import { GameOver } from "components/game-over";
import { Segment } from "semantic-ui-react";
import { MenuContainer } from "components/menu-container";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;

    public render() {
        return (
            <MenuContainer>
                <section className={css.multiPlayer}>
                    <div className={css.scoreboard}>
                        <Scoreboard />
                    </div>
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
        );
    }
}
