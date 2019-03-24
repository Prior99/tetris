import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { History } from "history";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { WinningCondition, WinningConditionType } from "types";
import { Configure } from "../configure";
import { MenuContainer } from "components/menu-container";
import { Button, Segment } from "semantic-ui-react";

function winningConditionToString(winningCondition: WinningCondition) {
    switch (winningCondition.condition) {
        case WinningConditionType.BATTLE_ROYALE:
            return `/${WinningConditionType.BATTLE_ROYALE}/${winningCondition.lives}`;
        case WinningConditionType.CLEAR_GARBAGE:
            return `/${WinningConditionType.CLEAR_GARBAGE}`;
        case WinningConditionType.HIGHEST_SCORE_ONE_GAME:
            return `/${WinningConditionType.HIGHEST_SCORE_ONE_GAME}`;
        case WinningConditionType.SUM_IN_TIME:
            return `/${WinningConditionType.SUM_IN_TIME}/${winningCondition.seconds}`;
    }
}

function levelUpToString(levelUpDisabled: boolean) {
    return levelUpDisabled ? "/no-levelup" : "/levelup";
}

@external @observer
export class SinglePlayerSetup extends React.Component {
    @inject private ui: UI;
    @inject("History") private history: History;

    @bind private handleBack() { this.history.push("/main-menu"); }

    @bind private handleStart() {
        const {
            initialGarbageLines,
            garbageMode,
            initialLevel,
            levelUpDisabled,
            winningCondition,
        } = this.ui.parameters;
        let url = "/single-player";
        url += `/${initialGarbageLines}`;
        url += `/${garbageMode}`;
        url += `/${initialLevel}`;
        url += levelUpToString(levelUpDisabled);
        url += winningConditionToString(winningCondition).replace(/ /g, "-");
        this.history.push(url);
    }

    public render() {
        return (
            <MenuContainer>
                <Segment>
                    <h1>Start Game</h1>
                    <Configure
                        onChange={parameters => this.ui.parameters = parameters}
                        parameters={this.ui.parameters}
                        enabled={true}
                        singleplayer
                    />
                    <br />
                    <Button.Group fluid>
                        <Button onClick={this.handleBack}>Back</Button>
                        <Button primary onClick={this.handleStart}>Start</Button>
                    </Button.Group>
                </Segment>
            </MenuContainer>
        );
    }
}
