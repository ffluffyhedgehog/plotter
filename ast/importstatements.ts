import { Statement } from "./index";

export interface ImportStatement extends Statement {
  pushElement(el: string);
}
export class ImportVariablesStatement implements ImportStatement {
  variables: string[] = [];
  pushElement(el: string) {
    this.variables.push(el)
  }
}
export class ImportStripsStatement implements ImportStatement {
  strips: string[] = [];
  pushElement(el: string) {
    this.strips.push(el)
  }
}