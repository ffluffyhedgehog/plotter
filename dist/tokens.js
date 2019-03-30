"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenTypes;
(function (TokenTypes) {
    TokenTypes.StringLiteral = "stringLiteral";
    TokenTypes.IntegerLiteral = "integerLiteral";
    TokenTypes.Identifier = "identifier";
    TokenTypes.EOF = "eof";
    TokenTypes.Unknown = "unknown";
    TokenTypes.And = "&&";
    TokenTypes.AndS = "&";
    TokenTypes.Or = "||";
    TokenTypes.OrS = "|";
    TokenTypes.Eq = "==";
    TokenTypes.Neq = "!=";
    TokenTypes.Lt = "<";
    TokenTypes.Rt = ">";
    TokenTypes.Plus = "+";
    TokenTypes.Minus = "-";
    // Reserved
    TokenTypes.Declare = "declare";
    TokenTypes.Block = "block";
    TokenTypes.From = "from";
    TokenTypes.Strip = "strip";
    TokenTypes.Asking = "asking";
    TokenTypes.Answers = "answers";
    TokenTypes.Named = "named";
    TokenTypes.Leading = "leading";
    TokenTypes.To = "to";
    TokenTypes.Because = "because";
    TokenTypes.Default = "default";
    TokenTypes.Import = "import";
    TokenTypes.Strips = "strips";
    TokenTypes.Variables = "variables";
    TokenTypes.CommentStart = "--";
    TokenTypes.With = "with";
    TokenTypes.Lparent = "(";
    TokenTypes.Rparent = ")";
    TokenTypes.Lbrace = "{";
    TokenTypes.Rbrace = "}";
    TokenTypes.Lbrack = "[";
    TokenTypes.Rbrack = "]";
    TokenTypes.Semi = ";";
    TokenTypes.Comma = ",";
    TokenTypes.Dot = ".";
})(TokenTypes = exports.TokenTypes || (exports.TokenTypes = {}));
var Token = /** @class */ (function () {
    function Token(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
        if (type == 'unknown') {
            throw new Error('Unknown token');
        }
    }
    Token.prototype.getType = function () {
        return this.type;
    };
    return Token;
}());
exports.Token = Token;
var CharUtils;
(function (CharUtils) {
    var operators = [
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
        TokenTypes.Dot
    ];
    var reserved = [
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
        TokenTypes.With
    ];
    var postfixOperators = ["+", "-"];
    var compOperators = ["=", "!", "<", ">"];
    var logicalOperators = ["&&", "||", '&', '|'];
    var punctuationChars = [";", ","];
    var arithmeticOperators = [TokenTypes.Plus, TokenTypes.Minus, TokenTypes.Dot];
    function isLetter(character) {
        return /^[a-zA-Z]$/gm.test(character);
    }
    CharUtils.isLetter = isLetter;
    function isDigit(character) {
        return /^[0-9]$/gm.test(character);
    }
    CharUtils.isDigit = isDigit;
    function isOperator(character) {
        return operators.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isOperator = isOperator;
    function isComparisonOperator(character) {
        return compOperators.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isComparisonOperator = isComparisonOperator;
    function isArithmeticOperator(character) {
        return arithmeticOperators.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isArithmeticOperator = isArithmeticOperator;
    function isPostfixOperator(character) {
        return postfixOperators.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isPostfixOperator = isPostfixOperator;
    function isLogicalOperator(character) {
        return logicalOperators.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isLogicalOperator = isLogicalOperator;
    function isParenthesis(character) {
        return character === "(" || character === ")";
    }
    CharUtils.isParenthesis = isParenthesis;
    function isNewLine(character) {
        return /\n/.test(character);
    }
    CharUtils.isNewLine = isNewLine;
    function isWhitespaceOrNewLine(character) {
        return character === " " || character === "\t" || isNewLine(character);
    }
    CharUtils.isWhitespaceOrNewLine = isWhitespaceOrNewLine;
    function isPunctuation(character) {
        return punctuationChars.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isPunctuation = isPunctuation;
    function isIdentifierReserved(character) {
        return reserved.indexOf(character) !== -1 ? true : false;
    }
    CharUtils.isIdentifierReserved = isIdentifierReserved;
    function isBrace(character) {
        return character === "{" || character === "}";
    }
    CharUtils.isBrace = isBrace;
    function isBracket(character) {
        return character === "[" || character === "]";
    }
    CharUtils.isBracket = isBracket;
})(CharUtils = exports.CharUtils || (exports.CharUtils = {}));
// console.log(CharUtils)
// console.log(isLogicalOperator('||'));
// console.log(isOperator('||'));
// console.log(isIdentifierReserved('declare block'))
//# sourceMappingURL=tokens.js.map