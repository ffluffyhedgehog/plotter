"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var auto_1 = require("./auto");
var tokens_1 = require("./tokens");
var States = {
    Initial: 1,
    Integer: 2,
    NoNextState: -1
};
var equalToState = function (current) { return function (stateName) { return current === States[stateName]; }; };
function nextState(currentState, character) {
    var stateIs = equalToState(currentState);
    if (stateIs("Initial") && tokens_1.CharUtils.isDigit(character)) {
        return States.Integer;
    }
    if (stateIs("Integer")) {
        if (tokens_1.CharUtils.isDigit(character)) {
            return States.Integer;
        }
    }
    return States.NoNextState;
}
var NumberAutomata = /** @class */ (function (_super) {
    __extends(NumberAutomata, _super);
    function NumberAutomata() {
        var _this = this;
        var acceptingStates = new Set([States.Integer]);
        _this = _super.call(this, Object.values(States), States.Initial, acceptingStates, nextState) || this;
        _this.states = States;
        return _this;
    }
    return NumberAutomata;
}(auto_1.Automata));
exports.NumberAutomata = NumberAutomata;
//# sourceMappingURL=numAuto.js.map