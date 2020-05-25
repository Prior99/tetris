import * as React from "react";
import { GameParameters, WinningConditionType, GarbageMode, WinningCondition } from "types";
import { bind } from "lodash-decorators";
import { computed } from "mobx";
import { Form } from "semantic-ui-react";

interface ConfigureProps {
    enabled: boolean;
    parameters: GameParameters;
    singleplayer?: true;
    onChange: (parameters: GameParameters) => void;
}

function winningConditionFromType(condition: WinningConditionType): WinningCondition {
    switch (condition) {
        case WinningConditionType.BATTLE_ROYALE: return { condition, lives: 1 };
        case WinningConditionType.HIGHEST_SCORE_ONE_GAME: return { condition };
        case WinningConditionType.SUM_IN_TIME: return { condition, seconds: 180 };
        case WinningConditionType.CLEAR_GARBAGE: return { condition };
    }
}

export class Configure extends React.Component<ConfigureProps> {
    @bind private handleWinningCondition(_, { value }: { value: WinningConditionType }) {
        const winningCondition = winningConditionFromType(value);
        this.props.onChange({ ...this.props.parameters, winningCondition });
    }

    @bind private handleGarbageMode(_, { value: garbageMode }: { value: GarbageMode }) {
        this.props.onChange({ ...this.props.parameters, garbageMode });
    }

    @bind private handleInitialGarbageLines(evt: React.SyntheticEvent<HTMLInputElement>) {
        const initialGarbageLines = Number(evt.currentTarget.value);
        this.props.onChange({ ...this.props.parameters, initialGarbageLines });
    }

    @bind private handleLevelUpDisabled() {
        const levelUpDisabled = !this.props.parameters.levelUpDisabled;
        this.props.onChange({ ...this.props.parameters, levelUpDisabled });
    }

    @bind private handleInitialLevel(evt: React.SyntheticEvent<HTMLInputElement>) {
        const initialLevel = Number(evt.currentTarget.value);
        this.props.onChange({ ...this.props.parameters, initialLevel });
    }

    @bind private handleLives(evt: React.SyntheticEvent<HTMLInputElement>) {
        const lives = Number(evt.currentTarget.value);
        const winningCondition = { ...this.props.parameters.winningCondition, lives };
        this.props.onChange({ ...this.props.parameters, winningCondition });
    }

    @bind private handleSeconds(evt: React.SyntheticEvent<HTMLInputElement>) {
        const seconds = Number(evt.currentTarget.value);
        const winningCondition = { ...this.props.parameters.winningCondition, seconds };
        this.props.onChange({ ...this.props.parameters, winningCondition });
    }

    @computed private get garbageModeOptions() {
        return [
            { value: GarbageMode.NONE, text: "No Garbage" },
            { value: GarbageMode.HALF_REFERRED, text: "Half of cleard lines returned" },
            { value: GarbageMode.INITIAL_ONLY, text: "Only initial garbage" },
            { value: GarbageMode.FULL_REFERRED, text: "All cleared lines returned" },
        ];
    }

    @computed private get winningConditionOptions() {
        return [
            { value: WinningConditionType.BATTLE_ROYALE, text: "Battle Royale" },
            { value: WinningConditionType.HIGHEST_SCORE_ONE_GAME, text: "Highest Score" },
            { value: WinningConditionType.SUM_IN_TIME, text: "Time Trial" },
            { value: WinningConditionType.CLEAR_GARBAGE, text: "Clear Garbage" },
        ];
    }

    public render() {
        const { parameters, singleplayer, enabled } = this.props;
        const { winningCondition, garbageMode, initialGarbageLines, initialLevel, levelUpDisabled } = parameters;
        return (
            <>
                <Form>
                    <Form.Select
                        label="Winning condition"
                        options={this.winningConditionOptions}
                        value={winningCondition.condition}
                        onChange={this.handleWinningCondition}
                        disabled={!enabled}
                    />
                    {
                        winningCondition.condition === WinningConditionType.SUM_IN_TIME && (
                            <Form.Input
                                label="Seconds"
                                type="number"
                                onChange={this.handleSeconds}
                                value={`${winningCondition.seconds}`}
                                disabled={!enabled}
                            />
                        )
                    }
                    {
                        winningCondition.condition === WinningConditionType.BATTLE_ROYALE && (
                            <Form.Input
                                label="Lives"
                                type="number"
                                onChange={this.handleLives}
                                value={winningCondition.lives}
                                disabled={!enabled}
                            />
                        )
                    }
                    {
                        !singleplayer && (
                            <Form.Select
                                label="Garbage mode"
                                options={this.garbageModeOptions}
                                value={garbageMode}
                                onChange={this.handleGarbageMode}
                                disabled={!enabled}
                            />
                        )
                    }
                    <Form.Input
                        label="Initial lines of garbage"
                        type="number"
                        onChange={this.handleInitialGarbageLines}
                        value={initialGarbageLines}
                        disabled={!enabled}
                    />
                    <Form.Input
                        label="Initial level"
                        type="number"
                        onChange={this.handleInitialLevel}
                        value={initialLevel}
                        disabled={!enabled}
                    />
                    <Form.Checkbox
                        toggle
                        label="Level up disabled"
                        onClick={this.handleLevelUpDisabled}
                        checked={levelUpDisabled}
                        disabled={!enabled}
                    />
                </Form>
            </>
        );
    }
}
