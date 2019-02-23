"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const mobx_react_1 = require("mobx-react");
const React = require("react");
const loader_1 = require("loader");
const game_1 = require("./game");
const loader_screen_1 = require("./loader-screen");
let Router = class Router extends React.Component {
    render() {
        if (this.loader.done) {
            return React.createElement(game_1.Game, null);
        }
        return React.createElement(loader_screen_1.LoaderScreen, null);
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", loader_1.Loader)
], Router.prototype, "loader", void 0);
Router = __decorate([
    tsdi_1.external, mobx_react_1.observer
], Router);
exports.Router = Router;
//# sourceMappingURL=router.js.map