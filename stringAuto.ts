import { Automata } from "./auto";

const State = {
  Initial: 1,
  String: 2,
  Closing: 3,
  NoNextState: -1
};

const equalToState = current => stateName => current === State[stateName];

function nextState(currentState, character) {
  const stateIs = equalToState(currentState);

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

export class StringAutomata extends Automata {
  constructor() {
    const acceptedStates = new Set([State.String]);
    super(Object.values(State), State.Initial, acceptedStates, nextState);
    this.states = State;
  }
}
