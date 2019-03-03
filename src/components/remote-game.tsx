import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { OtherGameCanvas } from "./other-game-canvas";
import * as css from "./remote-game.scss";

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private networking: Networking;

    public render() {
        const { userId } = this.props;
        return (
            <section className={css.remoteGame}>
                <div className={css.headline}>{this.networking.userById(userId)!.name}</div>
                {
                    this.networking.isUserInitialized(userId) ? (
                        <OtherGameCanvas
                            state={this.networking.stateForUser(userId)!}
                            matrix={this.networking.playfieldForUser(userId)!}
                        />
                    ) : <></>
                }
            </section>
        );
    }
}
