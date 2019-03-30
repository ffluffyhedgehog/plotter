import { Parser } from "./parser";
import {
  Statement,
  ImportStatement,
  ImportStripsStatement,
  ImportVariablesStatement,
  StartingBlockStatement,
  Block,
  Answer,
  Consequence,
  Expression,
  IntegerLiteral,
  NotExpression,
  AndExpression,
  VariableReference,
  OrExpression,
  EqualExpression,
  NotEqualExpression,
  LessThanExpression,
  GreaterThanExpression,
  LessThanEqualExpression,
  GreaterThanEqualExpression,
  Effect,
  AnswerReference,
  TreeNode
} from "./ast";
import * as util from "util";


export class PlotterStateManipulator {
  private variables: string[] = null;
  private strips: string[] = null;
  private blocks: any = {};
  private program: Statement[];
  private startingBlock: string;


  private error(text) {
    throw new Error(`Error: ${text}`);
  }

  constructor(text: string) {
    const p = new Parser(text);
    this.program = p.parseProgram();
    this.getImport();
    this.getImport();
    this.getStart();
    this.getBlocks();
  }


  public processDecision(state: UserState, answerName: string) {
    if(!state.passedAnswers[state.currentBlock.blockName]) {
      state.passedAnswers[state.currentBlock.blockName] = {};
    }
    state.passedAnswers[state.currentBlock.blockName][answerName] = true;
    const block = this.blocks[state.currentBlock.blockName] as Block;
    const answer = block.answers.find(el => el.name === answerName);
    const con = this.getConsequence(state, answer);
    return this.processConsequence(state, con)
  }

  private processConsequence(state: UserState, con: Consequence) {
    console.log(con)
    if (con.effect) {
      switch (con.effect.operation) {
        case '+': {
          state.variables[con.effect.variable] += Number(con.effect.amount);
          break;
        }
        case '-': {
          state.variables[con.effect.variable] -= Number(con.effect.amount);
          break;
        }
      }
    }
    if (con.isTerminating) {
      state.ended = true;
    } else {
      state.currentBlock = this.convertBlock(this.blocks[con.nextBlock]);
    }

    return state;
  }

  private getConsequence(state: UserState, answer: Answer): Consequence {
    if (answer.consequences.length === 1) {
      return answer.consequences[0];
    }
    else {
      let theConsequence = null
      answer.consequences.forEach(con => {
        if (!con.isDefault && !theConsequence && this.checkConsequence(state, con)) {
          theConsequence = con;
        }
      });
      if (!theConsequence) {
        theConsequence = answer.consequences.find(el => el.isDefault);
      }
      return theConsequence;
    }
  }

  private checkConsequence(state: UserState, con: Consequence): boolean {
    return !!this.checkExpression(state, con.condition);
  }

  private checkExpression(state: UserState, expr: Expression): any {
    if (expr instanceof AndExpression) {
      return this.checkExpression(state, expr.getLHS()) && this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof NotExpression) {
      return !this.checkExpression(state, expr.getValue());
    } else if (expr instanceof OrExpression) {
      return this.checkExpression(state, expr.getLHS()) || this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof AnswerReference) {
      return !!state.passedAnswers[expr.blockName][expr.answerName];
    } else if (expr instanceof VariableReference) {
      return Number(state.variables[expr.name]);
    } else if (expr instanceof IntegerLiteral) {
      return Number(expr.getValue());
    } else if (expr instanceof LessThanEqualExpression) {
      return this.checkExpression(state, expr.getLHS()) <= this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof GreaterThanEqualExpression) {
      return this.checkExpression(state, expr.getLHS()) >= this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof LessThanExpression) {
      return this.checkExpression(state, expr.getLHS()) < this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof GreaterThanExpression) {
      return this.checkExpression(state, expr.getLHS()) > this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof EqualExpression) {
      return this.checkExpression(state, expr.getLHS()) == this.checkExpression(state, expr.getRHS());
    } else if (expr instanceof NotEqualExpression) {
      return this.checkExpression(state, expr.getLHS()) !== this.checkExpression(state, expr.getRHS());
    }
  }

  public getFreshState(): UserState {
    return {
      currentBlock: this.convertBlock(this.blocks[this.startingBlock]),
      variables: this.variables.reduce((prev, cur) => (prev[cur] = 0, prev), {}),
      passedAnswers: {},
      ended: false
    }
  }

  private convertBlock(block: Block): UserState.CurrentBlock {
    return {
      blockName: block.blockName,
      question: block.question,
      answers: block.answers.map(el => ({name: el.name, text: el.text}))
    }
  }

  private getBlocks() {
    this.program.forEach((block: Block) => {
      this.blocks[block.blockName] = block;
    });
  }
  private getImport() {
    const imp = this.program.shift();
    if (imp instanceof ImportVariablesStatement && !this.variables) {
      this.variables = imp.variables;
      return;
    }
    if (imp instanceof ImportStripsStatement && !this.strips) {
      this.strips = imp.strips;
      return;
    }
  }
  private getStart() {
    const def = this.program.pop();
    if (def instanceof StartingBlockStatement) {
      this.startingBlock = def.blockName;
    }
  }
}

export interface UserState {
  currentBlock: UserState.CurrentBlock;
  variables: any;
  passedAnswers: any;
  ended: boolean;
}
export namespace UserState {
  export class CurrentBlock {
    blockName: string
    question: string
    answers: {name: string, text: string}[];
  }
}