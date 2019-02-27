import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { RemoteUsers, NetworkGame } from "networking";
import { OtherGameCanvas } from "./other-game-canvas";
import * as css from "./remote-game.scss";

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private users: RemoteUsers;
    @inject private networkGame: NetworkGame;

    public render() {
        return (
            <section className={css.remoteGame}>
                <div className={css.headline}>{this.users.byId(this.props.userId)!.name}</div>
                <OtherGameCanvas matrix={this.networkGame.byUser(this.props.userId)!} />
            </section>
        );
    }
}
