import { Automata } from "./auto";
import { CharUtils } from "./tokens";

const States = {
  Initial: 1,
  Integer: 2,
  NoNextState: -1
};

const equalToState = current => stateName => current === States[stateName];

function nextState(currentState, character) {
  const stateIs = equalToState(currentState);

  if (stateIs("Initial") && CharUtils.isDigit(character)) {
    return States.Integer;
  }

  if (stateIs("Integer")) {
    if (CharUtils.isDigit(character)) {
      return States.Integer;
    }
  }
  return States.NoNextState;
}

export class NumberAutomata extends Automata {
  constructor() {
    const acceptingStates = new Set([States.Integer]);
    super(Object.values(States), States.Initial, acceptingStates, nextState);
    this.states = States;
  }
}
