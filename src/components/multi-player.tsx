import * as React from "react";
import { Networking, RemoteUsers, NetworkGame } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { OwnGameCanvas } from "./own-game-canvas";
import { OtherGameCanvas } from "./other-game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";
import { Sounds } from "audio";
import { RemoteGame } from "./remote-game";
import { GameState, ShuffleBag } from "game";
import { Input } from "input";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private sounds: Sounds;
    @inject private networking: Networking;
    @inject private users: RemoteUsers;
    @inject private networkGame: NetworkGame;
    @inject private shuffleBag: ShuffleBag;
    @inject private gameState: GameState;
    @inject private input: Input;

    @initialize protected initialize() {
        this.sounds.startGame();
        this.shuffleBag.seed(this.networkGame.seed);
        this.gameState.start();
        this.input.enable();
    }

    public render() {
        return (
            <section className={css.game}>
                <div className={css.wrapper}>
                    <OwnGameCanvas />
                    <Info />
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
