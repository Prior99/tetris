import * as PeerJS from "peerjs";
import { DataConnection } from "peerjs";

export class MockPeerJS implements PeerJS {
    public prototype: RTCIceServer;
    public connectionListeners: ((connection: DataConnection) => void)[] = [];
    public id = "MOCKID00000";
    public connections = [];
    public disconnected = true;
    public destroyed = false;

    public connect = jest.fn(() => new MockDataConnection());

    public call = jest.fn();
    
    public on = jest.fn((event: string, callback: () => void) => {
        switch (event) {
            case "open": callback(); return;
            case "connection": this.connectionListeners.push(callback);
        }
    }) as any;

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

export class MockDataConnection implements DataConnection {
    public dataListeners: ((data: any) => void)[] = [];
    public dataChannel: RTCDataChannel;
    public label: string;
    public metadata: any;
    public open: boolean;
    public peerConnection: any;
    public peer: string;
    public reliable: boolean;
    public serialization: string;
    public type: string;
    public buffSize: number;

    public send = jest.fn();

    public on = jest.fn((event: string, callback: () => void) => {
        switch (event) {
            case "data": this.dataListeners.push(callback); return;
            case "open": callback(); return;
        }
    }) as any;

    public off = jest.fn();

    public close = jest.fn();

    public emulateData(data: any) {
        this.dataListeners.forEach(listener => listener(data));
    }
}

export default MockPeerJS;
