import { Expression } from "./expression";
import { NumericalOperand } from "./numericalOperation";

export class IntegerLiteral implements Expression, NumericalOperand {
  private value: number;
  constructor(value: number) {
    this.value = value;
  }
  getValue = () => {
    return this.value;
  };
}
