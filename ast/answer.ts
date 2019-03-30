import { Consequence } from "./consequence";
export class Answer {
  name: string;
  text: string;
  consequences: Consequence[];
  constructor() {
    this.consequences = [];
  }
}