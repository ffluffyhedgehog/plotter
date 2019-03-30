"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Automata = /** @class */ (function () {
    function Automata(states, initialState, acceptingStates, nextState) {
        this.states = states;
        this.initialState = initialState;
        this.acceptingStates = acceptingStates;
        this.nextState = nextState;
    }
    Automata.prototype.run = function (input) {
        var _this = this;
        var currentState = this.initialState;
        var length = 0;
        input.split("").every(function (character, i) {
            var nextState = _this.nextState(currentState, character);
            if (nextState === Automata.NoNextState) {
                return false;
            }
            currentState = nextState;
            length = i;
            return true;
        });
        // console.log("returning from Auto");
        // console.log("from Auto", input.slice(0, length + 1));
        return {
            recognized: this.acceptingStates.has(currentState),
            value: input.slice(0, length + 1),
            state: currentState
        };
    };
    return Automata;
}());
exports.Automata = Automata;
(function (Automata) {
    Automata.NoNextState = -1;
})(Automata = exports.Automata || (exports.Automata = {}));
exports.Automata = Automata;
//# sourceMappingURL=auto.js.map