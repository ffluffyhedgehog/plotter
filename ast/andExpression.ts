import { Expression } from "./expression";
import { BooleanOperation } from "./booleanOperation";

export class AndExpression implements Expression, BooleanOperation {
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
