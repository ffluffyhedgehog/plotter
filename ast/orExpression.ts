import { Expression } from "./expression";

export class OrExpression implements Expression {
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
