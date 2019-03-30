export namespace TokenTypes {
  export const StringLiteral = "stringLiteral";
  export const IntegerLiteral = "integerLiteral";
  export const Identifier = "identifier";
  export const EOF = "eof";
  export const Unknown = "unknown";

  export const And = "&&";
  export const AndS = "&";
  export const Or = "||";
  export const OrS = "|";
  export const Eq = "==";
  export const Neq = "!=";
  export const Not = "!";
  export const Lt = "<";
  export const Rt = ">";
  export const LtEq = "<=";
  export const RtEq = ">=";
  export const Plus = "+";
  export const Minus = "-";

  // Reserved
  export const Declare = "declare";
  export const Block = "block"
  export const From = "from";
  export const Strip = "strip";

  export const Asking = "asking";
  export const Answers = "answers";

  export const Named = "named";
  export const Leading = "leading";
  export const To = "to";

  export const Because = "because";
  export const Default = "default";
  export const Terminate = "terminate";
  export const Import = "import";
  export const Strips = "strips";
  export const Variables = "variables";
  export const CommentStart = "--";
  export const With = "with";
  export const Mark = "mark";
  export const Starting = "starting";

  export const Lparent = "(";
  export const Rparent = ")";
  export const Lbrace = "{";
  export const Rbrace = "}";
  export const Lbrack = "[";
  export const Rbrack = "]";
  export const Semi = ";";
  export const Comma = ",";
  export const Dot = ".";
}

export class Token {
  private type: string;
  private value: string;
  private line: number;
  private column: number;

  constructor(type: string, value: string, line: number, column: number) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
    if (type == 'unknown') {
      throw new Error('Unknown token')
    }
  }
  public getLine(): number {
    return this.line;
  }
  public getColumn(): number {
    return this.column;
  }
  public getType(): string {
    return this.type;
  }
  public getValue(): string {
    return this.value;
  }
}

export namespace CharUtils {
  const operators = [
    TokenTypes.And,
    TokenTypes.Or,
    TokenTypes.AndS,
    TokenTypes.OrS,
    TokenTypes.Eq,
    TokenTypes.Neq,
    TokenTypes.Lt,
    TokenTypes.Rt,
    TokenTypes.Plus,
    TokenTypes.Minus,
    TokenTypes.Dot,
    TokenTypes.Not,
  ];

  const reserved = [
    TokenTypes.Terminate,
    TokenTypes.Declare,
    TokenTypes.Block,
    TokenTypes.From,
    TokenTypes.Strip,
    TokenTypes.Asking,
    TokenTypes.Answers,
    TokenTypes.Named,
    TokenTypes.Leading,
    TokenTypes.To,
    TokenTypes.Because,
    TokenTypes.Default,
    TokenTypes.Import,
    TokenTypes.Strips,
    TokenTypes.Variables,
    TokenTypes.CommentStart,
    TokenTypes.With,
    TokenTypes.Mark,
    TokenTypes.Starting,

  ];

  const postfixOperators = ["+", "-"];

  const compOperators = ["=", "!", "<", ">"];

  const logicalOperators = ["&&", "||", '&', '|'];

  const punctuationChars = [";", ","];

  const arithmeticOperators = [TokenTypes.Plus, TokenTypes.Minus, TokenTypes.Dot];

  export function isLetter(character: string): boolean {
    return /^[a-zA-Z]$/gm.test(character);
  }

  export function isDigit(character: string): boolean {
    return /^[0-9]$/gm.test(character);
  }

  export function isOperator(character: string): boolean {
    return operators.indexOf(character) !== -1 ? true : false;
  }

  export function isComparisonOperator(character: string): boolean {
    return compOperators.indexOf(character) !== -1 ? true : false;
  }

  export function isArithmeticOperator(character: string): boolean {
    return arithmeticOperators.indexOf(character) !== -1 ? true : false;
  }

  export function isPostfixOperator(character: string): boolean {
    return postfixOperators.indexOf(character) !== -1 ? true : false;
  }

  export function isLogicalOperator(character: string): boolean {
    return logicalOperators.indexOf(character) !== -1 ? true : false;
  }

  export function isParenthesis(character: string): boolean {
    return character === "(" || character === ")";
  }

  export function isNewLine(character: string): boolean {
    return /\n/.test(character);
  }

  export function isWhitespaceOrNewLine(character: string): boolean {
    return character === " " || character === "\t" || isNewLine(character);
  }

  export function isPunctuation(character: string): boolean {
    return punctuationChars.indexOf(character) !== -1 ? true : false;
  }

  export function isIdentifierReserved(character: string): boolean {
    return reserved.indexOf(character) !== -1 ? true : false;
  }

  export function isBrace(character: string): boolean {
    return character === "{" || character === "}";
  }
  export function isBracket(character: string): boolean {
    return character === "[" || character === "]";
  }
}

// console.log(CharUtils)

// console.log(isLogicalOperator('||'));
// console.log(isOperator('||'));

// console.log(isIdentifierReserved('declare block'))
