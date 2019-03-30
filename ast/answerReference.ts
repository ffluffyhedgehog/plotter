import { Expression } from "./expression";

export class AnswerReference implements Expression {
  blockName: string;
  answerName: string;
}