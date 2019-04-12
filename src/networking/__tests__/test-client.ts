import { Client } from "../client";
import { RemoteUsers } from "../remote-users";
import { NetworkGame } from "../network-game";
import { Chat } from "../chat";
import { MockPeerJS, MockDataConnection } from "../../__mocks__/peerjs";
import { MessageType } from "../messages";

describe("Client", () => {
    let client: Client;
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
        client = new Client(remoteUsers, chat, networkGame, "some id", name);
        mockPeerJS = (Client as any).peer;
    });

    describe("initially", () => {
        it("doesn't create a peer", () => expect(mockPeerJS).toBeUndefined());
    });

    describe("after calling `connect`", () => {
        let spySetOwnUser: jest.SpyInstance<any>;
        let connection: MockDataConnection;

        beforeEach(async () => {
            spySetOwnUser = jest.spyOn(remoteUsers, "setOwnUser");
            await client.connect();
            mockPeerJS = (client as any).peer;
            connection = (client as any).connection as any;
        });

        it("stores the id", () => expect(client.id).toBe("MOCKID00000"));

        it("adds the own user", () => expect(spySetOwnUser).toHaveBeenCalledWith(ownUser));

        it("sends `HELLO` message", () => {
            expect(connection.send).toHaveBeenCalledWith({
                message: MessageType.HELLO,
                user: remoteUsers.own,
            });
        });
    });
});
