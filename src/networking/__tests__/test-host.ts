import { Host } from "../host";
import { RemoteUsers } from "../remote-users";
import { NetworkGame } from "../network-game";
import { Chat } from "../chat";
import { MockPeerJS } from "../../__mocks__/peerjs";

describe("Host", () => {
    let host: Host;
    let remoteUsers: RemoteUsers;
    let chat: Chat;
    let networkGame: NetworkGame;
    let name: string;
    let mockPeerJS: MockPeerJS;

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

        it("adds the own user", () => expect(spySetOwnUser).toHaveBeenCalledWith({
            id: "MOCKID00000",
            name: "Some random name",
        }));

        it("listens for new connection", () => {
            expect(mockPeerJS.on).toHaveBeenCalledWith("connection", expect.any(Function));
        });
    });
});
