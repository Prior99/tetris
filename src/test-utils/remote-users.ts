import { RemoteUsers } from "../networking/remote-users";

export function createRemoteUsers(): RemoteUsers {
    const remoteUsers = new RemoteUsers();
    remoteUsers.add(
        {
            name: "User A",
            id: "user-id-a",
        }, {
            name: "User B",
            id: "user-id-b",
        }, {
            name: "User C",
            id: "user-id-c",
        },
    );
    remoteUsers.setOwnUser({
        name: "Own user",
        id: "user-id-own",
    });
    return remoteUsers;
}
