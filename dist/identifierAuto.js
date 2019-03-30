"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auto_1 = require("./auto");
var tokens_1 = require("./tokens");
function createAutomata() {
    var states = new Set([1, 2]);
    var initialState = 1;
    var acceptingStates = new Set([2]);
    var nextState = function (currentState, character) {
        switch (currentState) {
            case 1: {
                if (tokens_1.CharUtils.isLetter(character) || character === "_") {
                    return 2;
                }
                break;
            }
            case 2: {
                if (tokens_1.CharUtils.isLetter(character) ||
                    tokens_1.CharUtils.isDigit(character) ||
                    character === "_") {
                    return 2;
                }
                break;
            }
        }
        return auto_1.Automata.NoNextState;
    };
    var fsm = new auto_1.Automata(states, initialState, acceptingStates, nextState);
    return fsm;
}
exports.createAutomata = createAutomata;
//# sourceMappingURL=identifierAuto.js.map