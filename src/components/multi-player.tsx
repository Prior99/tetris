import * as React from "react";
import { Networking } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { ObservableGame } from "observable-game";
import { GameMode } from "types";
import { TetriminoPreviews } from "./tetrimino-previews";
import { OwnGameCanvas } from "./own-game-canvas";
import { Info } from "./info";
import * as css from "./multi-player.scss";
import { RemoteGame } from "./remote-game";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject private game: ObservableGame;

    public render() {
        return (
            <section className={css.multiPlayer}>
                <div className={css.wrapper}>
                    <Info />
                    <OwnGameCanvas />
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
        );
    }
}
