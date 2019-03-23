import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { ObservableGame } from "observable-game";
import { WinningCondition, WinningConditionType, GarbageMode, GameParameters } from "types";
import { UI } from "ui";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { GameOver } from "../game-over";
import { Info } from "../info";
import * as css from "./single-player.scss";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { MenuContainer } from "components/menu-container";

function winningConditionFromString(condition: WinningConditionType, secondsOrLives: string): WinningCondition {
    switch (condition) {
        case WinningConditionType.BATTLE_ROYALE:
            return { condition, lives: Number(secondsOrLives) };
        case WinningConditionType.CLEAR_GARBAGE:
            return { condition };
        case WinningConditionType.HIGHEST_SCORE_ONE_GAME:
            return { condition };
        case WinningConditionType.SUM_IN_TIME:
            return { condition, seconds: Number(secondsOrLives) };
    }
}

function levelUpFromString(levelUpDisabled: string) {
    switch (levelUpDisabled) {
        case "no-levelup": return true;
        case "levelup": return false;
    }
}

interface SinglePlayerProps {
    readonly match: {
        readonly params: {
            readonly initialLevel: string;
            readonly initialGarbageLines: string;
            readonly garbageMode: GarbageMode;
            readonly levelUpDisabled: string;
            readonly condition: WinningConditionType;
            readonly secondsOrLives: string;
        };
    };
}

@external @observer
export class SinglePlayer extends React.Component<SinglePlayerProps> {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;

    @observable private loading = true;

    @initialize protected initialize() {
        this.observableGame.start({ ...this.ui.parameters, ...this.parameters });
        this.loading = false;
    }

    private get parameters(): Partial<GameParameters> {
        const {
            initialGarbageLines,
            garbageMode,
            initialLevel,
            levelUpDisabled,
            condition,
            secondsOrLives,
        } = this.props.match.params;
        return {
            initialGarbageLines: Number(initialGarbageLines),
            garbageMode,
            initialLevel: Number(initialLevel),
            levelUpDisabled: levelUpFromString(levelUpDisabled),
            winningCondition: winningConditionFromString((condition as any).replace(/-/g, " "), secondsOrLives),
        };
    }

    public render() {
        if (this.loading) {
            return (
                <Dimmer active>
                    <Loader />
                </Dimmer>
            );
        }
        return (
            <MenuContainer>
                <div className={css.singlePlayer}>
                    <Info />
                    <Segment style={{ margin: 0 }}>
                        <GameCanvas><GameOver /></GameCanvas>
                    </Segment>
                    <TetriminoPreviews />
                </div>
            </MenuContainer>
        );
    }
}
