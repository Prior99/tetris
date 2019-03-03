import * as React from "react";
import { Networking, RemoteUsers, NetworkGame } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { Sounds } from "sounds";
import { ObservableGame } from "observable-game";
import { UI } from "ui";
import { GameMode } from "types";
import { TetriminoPreviews } from "./tetrimino-previews";
import { OwnGameCanvas } from "./own-game-canvas";
import { Info } from "./info";
import * as css from "./multi-player.scss";
import { RemoteGame } from "./remote-game";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject private users: RemoteUsers;
    @inject private networkGame: NetworkGame;
    @inject private game: ObservableGame;
    @inject private ui: UI;

    @initialize protected initialize() {
        this.game.start(GameMode.MULTI_PLAYER, this.networkGame.seed);
        this.ui.gameMode = GameMode.MULTI_PLAYER;
    }

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
                        this.users.all
                            .filter(user => user.id !== this.networking.id)
                            .map(user => <RemoteGame key={user.id} userId={user.id} />)
                    }
                </div>
            </section>
        );
    }
}
