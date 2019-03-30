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
var State = {
    Initial: 1,
    String: 2,
    Closing: 3,
    NoNextState: -1
};
var equalToState = function (current) { return function (stateName) { return current === State[stateName]; }; };
function nextState(currentState, character) {
    var stateIs = equalToState(currentState);
    if (stateIs("Initial") && character === '"') {
        return State.String;
    }
    if (stateIs("String") && character !== '"') {
        return State.String;
    }
    if (stateIs("String")) {
        return State.Closing;
    }
    return State.NoNextState;
}
var StringAutomata = /** @class */ (function (_super) {
    __extends(StringAutomata, _super);
    function StringAutomata() {
        var _this = this;
        var acceptedStates = new Set([State.String]);
        _this = _super.call(this, Object.values(State), State.Initial, acceptedStates, nextState) || this;
        _this.states = State;
        return _this;
    }
    return StringAutomata;
}(auto_1.Automata));
exports.StringAutomata = StringAutomata;
//# sourceMappingURL=stringAuto.js.map