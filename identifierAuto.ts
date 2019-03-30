import { Automata } from "./auto";
import { CharUtils }  from "./tokens";

export function createAutomata(): Automata {
  const states = new Set([1, 2]);
  const initialState = 1;
  const acceptingStates = new Set([2]);
  const nextState = (currentState: any, character: string) => {
    switch (currentState) {
      case 1: {
        if (CharUtils.isLetter(character) || character === "_") {
          return 2;
        }
        break;
      }
      case 2: {
        if (
          CharUtils.isLetter(character) ||
          CharUtils.isDigit(character) ||
          character === "_"
        ) {
          return 2;
        }
        break;
      }
    }

    return Automata.NoNextState;
  };
  const fsm = new Automata(states, initialState, acceptingStates, nextState);
  return fsm;
}
