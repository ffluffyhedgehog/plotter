import { TokenTypes, Token, CharUtils } from "./tokens";
import { Lexer } from "./lexer";

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
  AnswerReference
} from "./ast";
import { SemanticChecker } from "./semantics";

export class Parser {
  private binopLevels: any;
  private statements: Statement[];
  private lexer: Lexer;
  private tokens: Token[];
  private errorToken: Token;
  private currentToken: number;
  private errors: number;

  private get token() {
    return this.tokens[this.currentToken];
  }

  private initBinopLevels() {
    this.binopLevels = {};
    this.binopLevels[TokenTypes.And] = 10;
    this.binopLevels[TokenTypes.Or] = 10;
    this.binopLevels[TokenTypes.Lt] = 20;
    this.binopLevels[TokenTypes.Rt] = 20;
    this.binopLevels[TokenTypes.Eq] = 20;
    this.binopLevels[TokenTypes.Neq] = 20;
    this.binopLevels[TokenTypes.Plus] = 30;
    this.binopLevels[TokenTypes.Minus] = 30;
    this.binopLevels[TokenTypes.Dot] = 45;
    this.binopLevels[TokenTypes.Lbrace] = 50;
  }
  constructor(input: string) {
    this.initBinopLevels();
    this.lexer = new Lexer(input.trim());
    this.tokens = this.lexer.allTokens();
    this.currentToken = 0;
    this.errors = 0;
  }

  private error(expectedType: string) {
    const token = this.tokens[this.currentToken];
    if (token == this.errorToken) return;
    console.log(
      "ERROR: " + token.getType(),
      " at line " + token.getLine() + ", column " + token.getColumn(),
      "; Expected " + expectedType
    );

    this.errorToken = token;
    this.errors++;
    throw new Error(
      "Unexpected token type " + token.getType() + " expected " + expectedType
    );
  }

  private eatToken(expectedType: string): boolean {
    const actualType = this.token.getType();
    // console.log(`eat ${actualType} ${this.token.getValue()}` )
    if (expectedType === actualType) {
      this.nextToken();
      return true;
    } else {
      this.error(expectedType);
      return false;
    }
  }

  private eatTokenOf(expectedTypes: string[]): string {
    const actualType = this.token.getType();
    if (expectedTypes.includes(actualType)) {
      this.nextToken();
      return actualType;
    } else {
      this.error(expectedTypes.join(","));
      return actualType;
    }
  }

  private prevToken() {
    this.currentToken -= 1;
  }
  private nextToken() {
    this.currentToken += 1;
  }
  private nextTokenWithCheck(...expectedTypes: string[]) {
    // this.currentToken += 1;
    // const actualType = this.token.getType();
    // if (expectedType === actualType) {
    //   return true;
    // } else {
    //   this.error(expectedType);
    //   return false;
    // }
    this.currentToken += 1;
    const actualType = this.token.getType();
    // console.log(`nextch ${actualType} ${this.token.getValue()}` )
    if (expectedTypes.includes(actualType)) {
      return actualType;
    } else {
      this.error(expectedTypes.join(","));
      return actualType;
    }
  }

  private skipTo(follow: string[]) {
    while (this.token.getType() != TokenTypes.EOF) {
      for (let skip of follow) {
        if (this.token.getType() == skip) return;
      }
      this.nextToken();
    }
  }

  private rewind() {
    this.currentToken = 0;
  }

  public parseProgram() {
    this.statements = this.parseStatementList();
    // console.log(util.inspect(this.statements, {showHidden: false, depth: null}));
    
    const sem = new SemanticChecker(this.statements);
    sem.check();
    // this.eatToken(TokenTypes.EOF);
    return this.statements;
  }

  private parseStatementList(): Statement[] {
    this.skipTo([TokenTypes.Import]);
    const statementList: Statement[] = [this.parseImport(), this.parseImport()];
    while (this.token.getType() !== TokenTypes.Mark) {
      statementList.push(this.parseBlockDeclaration());
      // this.nextToken();
    }
    statementList.push(this.parseStartingBlockDeclaration());
    return statementList;
  }
  private parseBlockDeclaration() {
    const mtok = this.token;
    if (mtok.getType() !== TokenTypes.Declare) {
      this.error(TokenTypes.Declare);
    }
    const bl = new Block();
    this.nextTokenWithCheck(TokenTypes.Block);
    this.nextTokenWithCheck(TokenTypes.Identifier);
    bl.blockName = this.token.getValue();
    this.nextTokenWithCheck(TokenTypes.From);
    this.nextTokenWithCheck(TokenTypes.Strip);
    this.nextTokenWithCheck(TokenTypes.StringLiteral);
    bl.stripName = this.token.getValue();
    this.nextTokenWithCheck(TokenTypes.Asking);
    this.nextTokenWithCheck(TokenTypes.StringLiteral);
    bl.question = this.token.getValue();
    this.nextTokenWithCheck(TokenTypes.With);
    this.nextTokenWithCheck(TokenTypes.Answers);
    this.nextTokenWithCheck(TokenTypes.Lbrace);
    while (this.token.getType() !== TokenTypes.Rbrace) {
      bl.answers.push(this.parseAnswer());
    }
    this.nextTokenWithCheck(TokenTypes.Semi);
    this.nextToken();
    // console.log('FINISHED BLOCK')

    return bl;
  }
  private parseAnswer(): Answer {
    this.skipTo([TokenTypes.Identifier]);
    this.currentToken -= 1;
    const answ = new Answer();
    this.nextTokenWithCheck(TokenTypes.Identifier);
    answ.name = this.token.getValue();
    this.nextTokenWithCheck(TokenTypes.Named);
    this.nextTokenWithCheck(TokenTypes.StringLiteral);
    answ.text = this.token.getValue();
    this.nextTokenWithCheck(TokenTypes.Leading);
    this.nextTokenWithCheck(TokenTypes.To);
    this.nextTokenWithCheck(TokenTypes.Lbrack);
    while (this.token.getType() !== TokenTypes.Rbrack) {
      answ.consequences.push(this.parseConsequence());
    }
    this.nextToken();
    // console.log('FINISHED ANSWER')

    return answ;
  }
  private parseConsequence(): Consequence {
    const cons = new Consequence();
    this.nextTokenWithCheck(TokenTypes.Identifier, TokenTypes.Terminate);
    if (this.token.getType() == TokenTypes.Terminate) {
      cons.isTerminating = true;
    } else {
      cons.nextBlock = this.token.getValue();
    }
    this.nextTokenWithCheck(TokenTypes.Default, TokenTypes.Because);
    if (this.token.getType() == TokenTypes.Default) {
      cons.isDefault = true;
    } else {
      this.nextToken();
      cons.condition = this.parseExp();
      this.prevToken();
    }
    this.nextTokenWithCheck(TokenTypes.With, TokenTypes.Comma, TokenTypes.Rbrack);
    if (this.token.getType() == TokenTypes.With) {
      this.nextTokenWithCheck(TokenTypes.StringLiteral);
      cons.effect = new Effect();
      cons.effect.variable = this.token.getValue();
      this.nextTokenWithCheck(TokenTypes.Plus, TokenTypes.Minus);
      cons.effect.operation = this.token.getValue();
      this.nextTokenWithCheck(TokenTypes.IntegerLiteral);
      cons.effect.amount = Number(this.token.getValue());
      this.nextToken();
    }
    
    // console.log('FINISHED CONSEQUENCE')


    return cons;
  }

  private parseExp(): Expression {
    const lhs = this.parsePrimaryExp();
    return this.parseBinopRHS(0, lhs); // check for binops following exp
  }

  private parsePrimaryExp(): Expression {
    switch (this.token.getType()) {
      case TokenTypes.IntegerLiteral:
        const intValue = Number(this.token.getValue());
        this.eatToken(TokenTypes.IntegerLiteral);
        return new IntegerLiteral(intValue);

      case TokenTypes.StringLiteral:
        const stringVal = this.token.getValue();
        this.eatToken(TokenTypes.StringLiteral);
        return new VariableReference(stringVal);

      case TokenTypes.Identifier:
        const ar = new AnswerReference();
        ar.blockName = this.token.getValue();
        this.eatToken(TokenTypes.Identifier);
        this.eatToken(TokenTypes.Dot);
        ar.answerName = this.token.getValue();
        this.eatToken(TokenTypes.Identifier);
        return ar;

      case TokenTypes.Not:
        this.eatToken(TokenTypes.Not);
        return new NotExpression(this.parseExp());

      case TokenTypes.Lparent:
        this.eatToken(TokenTypes.Lparent);
        const exp = this.parseExp();
        this.eatToken(TokenTypes.Rparent);
        return exp;

      default:
        // unrecognizable expression
        this.eatToken(TokenTypes.Unknown);
        this.nextToken();
        return null;
    }
  }

  private parseBinopRHS(level: number, lhs: Expression): Expression {
    // continuously parse exp until a lower order operator comes up
    while (true) {
      // grab operator precedence (-1 for non-operator token)
      let val = this.binopLevels[this.token.getType()];
      const tokenLevel = val !== undefined ? val : -1;

      // either op precedence is lower than prev op or token is not an op
      if (tokenLevel < level) return lhs;

      // save binop before parsing rhs of exp
      const binop = this.token.getType();
      this.eatToken(binop);

      let rhs = this.parsePrimaryExp(); // parse rhs of exp

      // grab operator precedence (-1 for non-operator token)
      val = this.binopLevels[this.token.getType()];
      const nextLevel = val !== undefined ? val : -1;

      // if next op has higher precedence than prev op, make recursive call
      if (tokenLevel < nextLevel) rhs = this.parseBinopRHS(tokenLevel + 1, rhs);

      // build AST for exp
      switch (binop) {
        case TokenTypes.And:
          lhs = new AndExpression(lhs, rhs);
          break;
        case TokenTypes.Or:
          lhs = new OrExpression(lhs, rhs);
          break;
        case TokenTypes.Eq:
          lhs = new EqualExpression(lhs, rhs);
          break;
        case TokenTypes.Neq:
          lhs = new NotEqualExpression(lhs, rhs);
          break;
        case TokenTypes.Lt:
          lhs = new LessThanExpression(lhs, rhs);
          break;
        case TokenTypes.Rt:
          lhs = new GreaterThanExpression(lhs, rhs);
          break;
        case TokenTypes.LtEq:
          lhs = new LessThanEqualExpression(lhs, rhs);
          break;
        case TokenTypes.RtEq:
          lhs = new GreaterThanEqualExpression(lhs, rhs);
          break;
        default:
          this.eatToken(TokenTypes.Unknown);
          break;
      }
    }
  }
  private parseStartingBlockDeclaration() {
    const mtok = this.token;
    if (mtok.getType() !== TokenTypes.Mark) {
      this.error(TokenTypes.Mark);
    }
    this.nextTokenWithCheck(TokenTypes.Block);
    this.nextTokenWithCheck(TokenTypes.Identifier);
    const blockname = this.token;
    this.nextTokenWithCheck(TokenTypes.Starting);
    this.nextTokenWithCheck(TokenTypes.Semi);
    const st = new StartingBlockStatement();
    st.blockName = blockname.getValue();
    return st;
  }
  private parseImport() {
    const importToken = this.token;
    if (importToken.getType() !== TokenTypes.Import) {
      this.error(TokenTypes.Import);
    }
    let importType = this.nextTokenWithCheck(
      TokenTypes.Strips,
      TokenTypes.Variables
    );

    const importstatement: ImportStatement =
      importType === TokenTypes.Strips
        ? new ImportStripsStatement()
        : new ImportVariablesStatement();

    while (this.token.getType() !== TokenTypes.Semi) {
      this.nextTokenWithCheck(TokenTypes.StringLiteral);
      importstatement.pushElement(this.token.getValue());
      this.nextTokenWithCheck(TokenTypes.Comma, TokenTypes.Semi);
    }
    this.nextToken();

    return importstatement;
  }
}
