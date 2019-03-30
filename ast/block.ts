import { Answer } from "./answer";
import { Statement } from "./statement";
export class Block implements Statement {
  blockName: string;
  stripName: string;
  question: string;
  answers: Answer[];
  constructor() {
    this.answers = [];
  }
}
