jest.mock("./src/factories/factory-audio-context");
jest.mock("./src/sounds");
jest.mock("./src/resources/audio/audio");
jest.mock("./src/utils/create-canvas");
jest.mock("./src/resources/sprites/image-manager");

import { setupJestScreenshot } from "jest-screenshot";
import { TSDI } from "tsdi";
import { Loader } from "resources";

declare namespace global {
    let tsdi: TSDI;
}
declare let tsdi: TSDI;

setupJestScreenshot();

beforeEach(async () => {
    global.tsdi = new TSDI();
    tsdi.enableComponentScanner();
    await tsdi.get(Loader).loadAll();
});

afterEach(() => {
    tsdi.close();
});
