import * as React from "react";
import { leaderboardEnabled } from "utils";
import { GameParameters, WinningConditionType, GarbageMode, WinningCondition } from "types";
import { bind } from "lodash-decorators";
import * as css from "./configure.scss";

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
    @bind private handleWinningCondition(evt: React.SyntheticEvent<HTMLSelectElement>) {
        const winningCondition = winningConditionFromType(evt.currentTarget.value as any);
        this.props.onChange({ ...this.props.parameters, winningCondition });
    }

    @bind private handleGarbageMode(evt: React.SyntheticEvent<HTMLSelectElement>) {
        const garbageMode: GarbageMode = evt.currentTarget.value as any;
        this.props.onChange({ ...this.props.parameters, garbageMode });
    }

    @bind private handleInitialGarbageLines(evt: React.SyntheticEvent<HTMLInputElement>) {
        const initialGarbageLines = Number(evt.currentTarget.value);
        this.props.onChange({ ...this.props.parameters, initialGarbageLines });
    }

    @bind private handleLevelUpDisabled(evt: React.SyntheticEvent<HTMLInputElement>) {
        const levelUpDisabled = evt.currentTarget.checked;
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

    public render() {
        return (
            <section className={css.configure}>
                <div className={css.scoringEnabled}>
                    {
                        leaderboardEnabled(this.props.parameters)
                            ? <div className={css.enabled}>Leaderboard enabled</div>
                            : <div className={css.disable}>Leaderboard disabled</div>
                    }
                </div>
                <div className={css.field}>
                    <label>
                        Winning condition
                        <select
                            disabled={!this.props.enabled}
                            onChange={this.handleWinningCondition}
                            value={this.props.parameters.winningCondition.condition}
                        >
                            <option value={WinningConditionType.BATTLE_ROYALE}>Battle Royale</option>
                            <option value={WinningConditionType.HIGHEST_SCORE_ONE_GAME}>Highest Score</option>
                            <option value={WinningConditionType.SUM_IN_TIME}>Score sum in time</option>
                            <option value={WinningConditionType.CLEAR_GARBAGE}>Clear garbage</option>
                        </select>
                    </label>
                </div>
                {
                    this.props.parameters.winningCondition.condition === WinningConditionType.SUM_IN_TIME ? (
                        <div className={css.field}>
                            <label>
                                Seconds
                                <input
                                    disabled={!this.props.enabled}
                                    type="number"
                                    onChange={this.handleSeconds}
                                    value={this.props.parameters.winningCondition.seconds}
                                />
                            </label>
                        </div>
                    ) : <></>
                }
                {
                    this.props.parameters.winningCondition.condition === WinningConditionType.BATTLE_ROYALE ? (
                        <div className={css.field}>
                            <label>
                                Lives
                                <input
                                    disabled={!this.props.enabled}
                                    type="number"
                                    onChange={this.handleLives}
                                    value={this.props.parameters.winningCondition.lives}
                                />
                            </label>
                        </div>
                    ) : <></>
                }
                {
                    !this.props.singleplayer ? <>
                        <div className={css.field}>
                            <label>
                                Garbage mode
                                <select
                                    disabled={!this.props.enabled}
                                    onChange={this.handleGarbageMode}
                                    value={this.props.parameters.garbageMode}
                                >
                                    <option value={GarbageMode.NONE}>No garbage</option>
                                    <option value={GarbageMode.INITIAL_ONLY}>Only initial</option>
                                    <option value={GarbageMode.HALF_REFERRED}>Half of cleared returned</option>
                                    <option value={GarbageMode.FULL_REFERRED}>All cleared returned</option>
                                </select>
                            </label>
                        </div>
                    </> : <></>
                }
                <div className={css.field}>
                    <label>
                        Initial lines of garbage
                        <input
                            disabled={!this.props.enabled}
                            type="number"
                            onChange={this.handleInitialGarbageLines}
                            value={this.props.parameters.initialGarbageLines}
                        />
                    </label>
                </div>
                <div className={css.field}>
                    <label>
                        Initial level
                        <input
                            disabled={!this.props.enabled}
                            type="number"
                            onChange={this.handleInitialLevel}
                            value={this.props.parameters.initialLevel}
                        />
                    </label>
                </div>
                <div className={css.field}>
                    Level up disabled
                    <input
                        disabled={!this.props.enabled}
                        type="checkbox"
                        onChange={this.handleLevelUpDisabled}
                        checked={this.props.parameters.levelUpDisabled}
                    />
                </div>
            </section>
        );
    }
}
