import { Expression } from "./expression";
import { NumericalOperation } from "./numericalOperation";

export class NotEqualExpression implements Expression, NumericalOperation {
  discriminator: "TREENODE";
  private lhs: Expression;
  private rhs: Expression;
  constructor(lhs: Expression, rhs: Expression) {
    this.lhs = lhs;
    this.rhs = rhs;
  }
  getLHS = () => {
    return this.lhs;
  };
  getRHS = () => {
    return this.rhs;
  };
}
