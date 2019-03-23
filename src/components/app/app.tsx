import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { History } from "history";
import * as React from "react";
import { Route, Switch, Router, Redirect } from "react-router-dom";
import { Loader } from "resources";
import { UI } from "ui";
import { SinglePlayer } from "../single-player";
import { Settings } from "../settings";
import { MainMenu } from "../main-menu";
import { LoaderScreen } from "../loader-screen";
import { Connect } from "../connect";
import { Lobby } from "../lobby";
import { MultiPlayer } from "../multi-player";
import { LeaderboardView } from "../leaderboard-view";
import { SinglePlayerSetup } from "../single-player-setup";
import { Background } from "../background";

@external @observer
export class App extends React.Component {
    @inject("History") private history: History;
    @inject private loader: Loader;
    @inject private ui: UI;

    public render() {
        if (!this.loader.done) { return <LoaderScreen />; }
        return (
            <>
                <Background />
                <Router history={this.history}>
                    <Switch>
                        <Redirect exact from="/" to="main-menu" />
                        <Route exact path="/main-menu" component={MainMenu} />
                        <Route exact path="/single-player/:initialGarbageLines/:garbageMode/:levelUpDisabled/:condition" component={SinglePlayer} /> {/* tslint:disable-line */}
                        <Route exact path="/single-player/:initialGarbageLines/:garbageMode/:levelUpDisabled/:condition/:secondsOrLives" component={SinglePlayer} /> {/* tslint:disable-line */}
                        <Route exact path="/settings" component={Settings} />
                        <Route exact path="/lobby/:mode" component={Lobby} />
                        <Route exact path="/lobby/:mode/:id" component={Lobby} />
                        <Route exact path="/connect" component={Connect} />
                        <Route exact path="/multi-player" component={MultiPlayer} />
                        <Route exact path="/leaderboard" component={LeaderboardView} />
                        <Route exact path="/single-player-setup" component={SinglePlayerSetup} />
                    </Switch>
                </Router>
            </>
        );
    }
}
