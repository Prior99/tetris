import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { History } from "history";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import * as css from "./connect.scss";
import { MenuContainer } from "components/menu-container";
import { Segment, Form, Input, Tab } from "semantic-ui-react";

@external @observer
export class Connect extends React.Component {
    @inject private ui: UI;
    @inject("History") private history: History;

    @observable private otherId = "";
    @observable private activeTab = 0;

    @bind private handleBack() {
        this.history.push("/main-menu");
    }

    @bind private handleNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.ui.name = evt.currentTarget.value;
    }

    @bind private handleOtherIdChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.otherId = evt.currentTarget.value;
    }

    @bind private handleHost() {
        this.history.push("/lobby/host");
    }

    @bind private handleConnect() {
        this.history.push(`/lobby/connect/${this.otherId}`);
    }

    @bind private handleTabChange(_, { activeIndex }: { activeIndex: number }) {
        this.activeTab = activeIndex;
    }

    private get panes() {
        return [
            { menuItem: "Join" },
            { menuItem: "Host" },
        ];
    }

    public render() {
        return (
            <MenuContainer>
                <Segment>
                    <h1>Connect</h1>
                    <Form>
                        <Form.Field>
                            <label>Change name</label>
                            <Input value={this.ui.name} onChange={this.handleNameChange} />
                        </Form.Field>
                        <Tab
                            className={css.tabs}
                            panes={this.panes}
                            activeIndex={this.activeTab}
                            onTabChange={this.handleTabChange}
                        />
                        {
                            this.activeTab === 0 && (
                                <>
                                    <Form.Field>
                                        <label>Join</label>
                                        <Input value={this.otherId} onChange={this.handleOtherIdChange} />
                                    </Form.Field>
                                    <Form.Button primary fluid onClick={this.handleConnect}>Join</Form.Button>
                                </>
                            )
                        }
                        {
                            this.activeTab === 1 && (
                                <Form.Button primary fluid onClick={this.handleHost}>Host</Form.Button>
                            )
                        }
                        <Form.Button fluid onClick={this.handleBack}>Back</Form.Button>
                    </Form>
                </Segment>
            </MenuContainer>
        );
    }
}
