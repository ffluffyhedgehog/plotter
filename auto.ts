export class Automata {
  protected states: any;
  protected initialState: any;
  protected acceptingStates: any;
  protected nextState: Function;

  constructor(
    states: any,
    initialState: any,
    acceptingStates: any,
    nextState: Function
  ) {
    this.states = states;
    this.initialState = initialState;
    this.acceptingStates = acceptingStates;
    this.nextState = nextState;
  }

  run(input: string): any {
    let currentState = this.initialState;
    let length = 0;

    input.split("").every((character, i) => {
      let nextState = this.nextState(currentState, character);

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
  }
}

export namespace Automata {
  export const NoNextState = -1;
}
