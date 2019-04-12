import { Host } from "../host";
import { RemoteUsers } from "../remote-users";
import { NetworkGame } from "../network-game";
import { Chat } from "../chat";
import { MockPeerJS, MockDataConnection } from "../../__mocks__/peerjs";
import { MessageType } from "../messages";
import { RemoteUser, GameParameters } from "../../types";

describe("Host", () => {
    let host: Host;
    let remoteUsers: RemoteUsers;
    let chat: Chat;
    let networkGame: NetworkGame;
    let name: string;
    let mockPeerJS: MockPeerJS;
    const ownUser = {
        id: "MOCKID00000",
        name: "Some random name",
    };

    beforeEach(() => {
        chat = new Chat();
        remoteUsers = new RemoteUsers();
        networkGame = new NetworkGame(remoteUsers);
        name = "Some name";
        host = new Host(remoteUsers, chat, networkGame, name);
        mockPeerJS = (host as any).peer;
    });

    describe("initially", () => {
        it("doesn't create a peer", () => expect(mockPeerJS).toBeUndefined());
    });

    describe("after calling `host`", () => {
        let spySetOwnUser: jest.SpyInstance<any>;

        beforeEach(async () => {
            spySetOwnUser = jest.spyOn(remoteUsers, "setOwnUser");
            await host.host();
            mockPeerJS = (host as any).peer;
        });

        it("stores the id", () => expect(host.id).toBe("MOCKID00000"));

        it("adds the own user", () => expect(spySetOwnUser).toHaveBeenCalledWith(ownUser));

        it("listens for new connection", () => {
            expect(mockPeerJS.on).toHaveBeenCalledWith("connection", expect.any(Function));
        });

        describe("with two client connected", () => {
            let connections: MockDataConnection[] = [];
            let otherUsers: RemoteUser[] = [];

            beforeEach(() => {
                connections = [new MockDataConnection(), new MockDataConnection()];
                otherUsers = connections.map((_, index) => ({
                    name: `Another user #${index}`,
                    id: `ANOTHERID0000${index}`,
                }));
                connections.forEach(connection => mockPeerJS.emulateConnection(connection));
            });

            it("subscribed to incoming data", () => connections.forEach(connection => {
                expect(connection.on).toHaveBeenCalledWith("data", expect.any(Function));
            }));

            describe("with both clients having sent `HELLO`", () => {
                beforeEach(() => connections.forEach((connection, index) => {
                    connection.emulateData({
                        message: MessageType.HELLO,
                        user: otherUsers[index],
                    });
                }));

                it("sent `WELCOME` with only the own user to the first connection", () => {
                    expect(connections[0].send).toHaveBeenNthCalledWith(1, {
                        message: MessageType.WELCOME,
                        parameters: networkGame.parameters,
                        users: [otherUsers[0], ownUser],
                    });
                });

                it("sent `WELCOME` with two users to the second connection", () => {
                    expect(connections[1].send).toHaveBeenNthCalledWith(1, {
                        message: MessageType.WELCOME,
                        parameters: networkGame.parameters,
                        users: [otherUsers[0], otherUsers[1], ownUser],
                    });
                });

                it("sent `USER_CONNECTED` message to first connection", () => {
                    expect(connections[0].send).toHaveBeenNthCalledWith(2, {
                        message: MessageType.USER_CONNECTED,
                        user: otherUsers[1],
                    });
                });

                describe("when sending a chat message to the host", () => {
                    let spyChatAdd: jest.SpyInstance<any>;

                    beforeEach(() => {
                        spyChatAdd = jest.spyOn(chat, "add");
                        connections[0].emulateData({
                            message: MessageType.CHAT_MESSAGE,
                            chatMessage: "some text",
                        });
                    });

                    it("forwards message to connection #2", () => expect(connections[1].send).toHaveBeenLastCalledWith({
                        message: MessageType.CHAT_MESSAGE,
                        chatMessage: "some text",
                    }));

                    it("appends the message to the chat module", () => {
                        expect(spyChatAdd).toHaveBeenCalledWith("some text");
                    });
                });

                describe("when changing parameters", () => {
                    let parameters: GameParameters;
                    beforeEach(() => {
                        parameters = {
                            ...networkGame.parameters,
                            levelUpDisabled: true,
                        };

                        host.sendParameterChange(parameters);
                    });

                    it("sends `PARAMETERS_CHANGE` to both connections", () => {
                        connections.forEach(connection => {
                            expect(connection.send).toBeCalledWith({
                                message: MessageType.PARAMETERS_CHANGE,
                                parameters,
                            });
                        });
                    });
                });

                describe("when starting the game", () => {
                    let spyStartNetworkGame: jest.SpyInstance<any>;

                    beforeEach(() => {
                        spyStartNetworkGame = jest.spyOn(host as any, "startNetworkGame").mockImplementation();
                        host.sendStartGame();
                    });

                    it("sends `START` to both connections", () => {
                        connections.forEach(connection => {
                            expect(connection.send).toBeCalledWith({
                                message: MessageType.START,
                                parameters: networkGame.parameters,
                            });
                        });
                    });

                    it("calls `startNetworkGame`", () => {
                        expect(spyStartNetworkGame).toHaveBeenCalledWith(networkGame.parameters);
                    });

                    describe("when starting the game", () => {
                        let spyRestartNetworkGame: jest.SpyInstance<any>;

                        beforeEach(() => {
                            spyRestartNetworkGame = jest.spyOn(host as any, "restartNetworkGame").mockImplementation();
                            host.sendRestartGame();
                        });

                        it("sends `RESTART` to both connections", () => {
                            connections.forEach(connection => {
                                expect(connection.send).toBeCalledWith({
                                    message: MessageType.RESTART,
                                    parameters: networkGame.parameters,
                                });
                            });
                        });

                        it("calls `restartNetworkGame`", () => {
                            expect(spyRestartNetworkGame).toHaveBeenCalledWith(networkGame.parameters);
                        });
                    });
                });
            });
        });
    });
});
