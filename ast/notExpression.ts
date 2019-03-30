import { Expression } from "./expression";
import { BooleanOperation } from "./booleanOperation";

export class NotExpression implements Expression, BooleanOperation {
  discriminator: "TREENODE";
  private value: Expression;
  constructor(value: Expression) {
    this.value = value;
  }
  getValue = () => {
    return this.value;
  };
}
