import { NetworkGame } from "../networking/network-game";
import { RemoteUsers } from "../networking/remote-users";

export function createNetworkGame(remoteUsers: RemoteUsers): NetworkGame {
    const networkGame = new NetworkGame(remoteUsers);
    return networkGame;
}
