import { Expression } from "./expression";
import { Effect } from "./effect";

export class Consequence {
  isDefault: boolean;
  isTerminating: boolean;
  condition: Expression;
  effect: Effect;
  nextBlock: string;
}