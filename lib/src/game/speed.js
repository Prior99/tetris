"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function speed(level) {
    // According to gravity curve from Tetris worlds:
    // https://tetris.fandom.com/wiki/Tetris_Worlds
    switch (level) {
        case 0: return 1.00000;
        case 1: return 0.79300;
        case 2: return 0.61780;
        case 3: return 0.47273;
        case 4: return 0.35520;
        case 5: return 0.26200;
        case 6: return 0.18968;
        case 7: return 0.13473;
        case 8: return 0.09388;
        case 9: return 0.06415;
        case 10: return 0.04298;
        case 11: return 0.02822;
        case 12: return 0.01815;
        case 13: return 0.01144;
        case 14: return 0.00706;
        case 15: return 0.00426;
        case 16: return 0.00252;
        case 17: return 0.00146;
        case 18: return 0.00082;
        default: return 0.00046;
    }
}
exports.speed = speed;
//# sourceMappingURL=speed.js.map