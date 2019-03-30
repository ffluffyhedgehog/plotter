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

export class SemanticChecker {
  private variables: string[] = null;
  private strips: string[] = null;
  private blocks: any = {};
  private program: Statement[];
  constructor(program: Statement[]) {
    this.program = program.slice();
  }
  private error(text) {
    throw new Error(`Error: ${text}`);
  }
  check() {
    this.createBlockNames();
    this.checkImport();
    this.checkImport();
    this.checkStartingDeclaration();
    this.checkBlocks();
  }

  createBlockNames() {
    this.program.forEach(block => {
      if (block instanceof Block) {
        if (this.blocks[block.blockName]) {
          this.error(`Block name must be unique: ${block.blockName}`);
        }
        this.blocks[block.blockName] = block.answers.map(el => el.name);
        const uni = this.blocks[block.blockName].filter((val, ind, arr) => arr.indexOf(val) === ind);
        if (uni.length < this.blocks[block.blockName].length) {
          this.error(`Block ${block.blockName} has duplicate answer names.`);
        }
      }
    });
  }

  checkBlocks() {
    this.program.forEach((block: Block) => {
      if (!this.strips.includes(block.stripName)) {
        this.error(`There is no imported strip ${block.stripName}`);
      }
      block.answers.forEach(ans => {
        if (ans.consequences.filter(el => el.isDefault).length > 1) {
          this.error(`Answer ${block.blockName}.${ans.name} must have only one default consequence.`)
        }
        if (ans.consequences.filter(el => el.isDefault).length < 1) {
          this.error(`Answer ${block.blockName}.${ans.name} must have a default consequence.`)
        }
        ans.consequences.forEach(cons => {
          if (!cons.isTerminating) {
            this.checkBlockExistence(cons.nextBlock);
          }
          if (!cons.isDefault) {
            this.checkConsequenceCondition(cons.condition);
          }
        });
      });
    });
  }

  checkConsequenceCondition(el: Expression) {
    if (el instanceof AnswerReference) {
      this.checkAnswerReference(el);
    }
    if (el instanceof VariableReference) {
      this.checkVariableReference(el);
    }
    const ll = el as any;
    // console.log(ll)
    if (ll.getLHS) {
      this.checkConsequenceCondition(ll.getLHS());
    }
    if (ll.getRHS) {
      this.checkConsequenceCondition(ll.getRHS());
    }
    if (ll.getValue) {
      this.checkConsequenceCondition(ll.getValue());
    }
  }

  checkAnswerReference(el: AnswerReference) {
    this.checkBlockExistence(el.blockName);
    if (!this.blocks[el.blockName].includes(el.answerName)) {
      this.error(`Block ${el.blockName} has no answer ${el.answerName}`);
    }
  }
  checkVariableReference(el: VariableReference) {
    if (!this.variables.includes(el.name)) {
      this.error(`There is no imported variable ${el.name}`);
    }
  }

  checkBlockExistence(bn: string) {
    if (!this.blocks[bn]) {
      this.error(`Block ${bn} not declared.`);
    }
  }
  private checkStartingDeclaration() {
    const def = this.program.pop();
    if (def instanceof StartingBlockStatement) {
      if (!this.blocks[def.blockName]) {
        this.checkBlockExistence(def.blockName);
      }
    }
  }

  private checkImport() {
    const imp = this.program.shift();
    if (imp instanceof ImportVariablesStatement && !this.variables) {
      this.variables = imp.variables;
      return;
    }
    if (imp instanceof ImportStripsStatement && !this.strips) {
      this.strips = imp.strips;
      return;
    }
    this.error("No double or missing imports are allowed.");
  }
}
