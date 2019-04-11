import { DataConnection } from "peerjs";

export class MockPeerJS {
    public connectionListeners: ((connection: DataConnection) => void)[] = [];

    public id = "MOCKID00000";

    public connections = [];

    public disconnected = true;

    public destroyed = false;

    public connect = jest.fn();

    public call = jest.fn();
    
    public on = jest.fn((event: string, callback: () => void) => {
        switch (event) {
            case "open": callback(); return;
            case "connection": this.connectionListeners.push(callback);
        }
    });

    public off = jest.fn();

    public disconnect = jest.fn();

    public reconnect = jest.fn();

    public destroy = jest.fn();

    public getConnection = jest.fn();

    public listAllPeers = jest.fn();

    public emulateConnection(connection: DataConnection) {
        this.connectionListeners.forEach(listener => listener(connection));
    }
}

export default MockPeerJS;
