import { Expression } from "./expression";
import { NumericalOperand } from "./numericalOperation";

export class VariableReference implements Expression, NumericalOperand {
  constructor( public name: string) {
  }
}
