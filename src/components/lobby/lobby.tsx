import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import { History } from "history";
import { Networking } from "networking";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { NetworkingMode } from "types";
import { ChatMessage } from "../chat-message";
import { Configure } from "../configure";
import { MenuContainer } from "../menu-container";
import {
    Segment,
    Grid,
    Statistic,
    Dimmer,
    Loader,
    Message,
    Popup,
    Button,
    Comment,
    Form,
    List,
} from "semantic-ui-react";
import * as css from "./lobby.scss";

interface LobbyProps {
    readonly match: {
        readonly params: {
            readonly mode: "host";
        } | {
            readonly mode: "connect";
            readonly id: string;
        };
    };
}

@external @observer
export class Lobby extends React.Component<LobbyProps> {
    @inject private ui: UI;
    @inject private networking: Networking;
    @inject("History") private history: History;

    @observable private loading = true;
    @observable private chatText = "";

    @initialize protected async initialize() {
        const { params } = this.props.match;
        switch (params.mode) {
            case "host": await this.networking.host(this.ui.name); break;
            case "connect": await this.networking.client(params.id, this.ui.name); break;
            default: throw new Error(`Unknown lobby mode: ${JSON.stringify(params)}`);
        }
        this.loading = false;
    }

    @bind private handleBack() { this.history.push("/connect"); }

    @bind private handleChatTextChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.chatText = evt.currentTarget.value;
    }

    @bind private handleChatSend() {
        this.networking.sendChatMessage(this.chatText);
        this.chatText = "";
    }

    @bind private handleStart() {
        this.networking.sendStartGame();
    }

    @computed private get hasClipboardApi() {
        const anyNavigator = navigator as any;
        return Boolean(anyNavigator.clipboard);
    }

    @computed private get connectUrl() {
        return `${location.origin}/#/lobby/connect/${this.networking.hostId}`;
    }

    @computed private get popupText() {
        if (this.hasClipboardApi) {
            return "Copied to clipboard.";
        }
        return `Can't copy to clipboard: "${this.connectUrl}".`;
    }

    @bind private async handleIdClick() {
        if (this.hasClipboardApi) {
            const anyNavigator = navigator as any;
            await anyNavigator.clipboard.writeText(this.connectUrl);
        }
    }

    @computed private get isHost() {
        return this.networking.mode === NetworkingMode.HOST;
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
                <Grid className={css.lobbyGrid}>
                    <Grid.Column width={8}>
                        <Grid.Row className={css.lobbyRow}>
                            <Segment>
                                <h1>Users</h1>
                                <List relaxed>
                                    {
                                        this.networking.allUsers.map(user => {
                                            return <List.Item icon="user" key={user.id} content={user.name} />;
                                        })
                                    }
                                </List>
                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment>
                                <h1>Settings</h1>
                                <Configure
                                    onChange={parameters => this.networking.changeParameters(parameters)}
                                    parameters={this.networking.parameters}
                                    enabled={this.isHost}
                                />
                                <br />
                                <Button.Group fluid>
                                    <Button onClick={this.handleBack}>Back</Button>
                                    { this.isHost && <Button primary onClick={this.handleStart}>Start</Button> }
                                </Button.Group>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Grid.Row className={css.lobbyRow}>
                            <Popup
                                on="click"
                                trigger={
                                    <Message
                                        icon="globe"
                                        color="blue"
                                        onClick={this.handleIdClick}
                                        content={this.networking.hostId}
                                        className={css.message}
                                    />
                                }
                                content={this.popupText}
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <Segment>
                                <h1>Chat</h1>
                                <Comment.Group>
                                    <Comment content="Your chat history starts here." />
                                    {
                                        this.networking.chatMessages.map((message, index) => {
                                            return <ChatMessage key={index} message={message} />;
                                        })
                                    }
                                </Comment.Group>
                                <Form>
                                    <Form.Input
                                        value={this.chatText}
                                        onChange={this.handleChatTextChange}
                                        action={<Button primary onClick={this.handleChatSend}>Send</Button>}
                                    />
                                </Form>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </MenuContainer>
        );
    }
}
