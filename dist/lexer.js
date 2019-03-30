"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_1 = require("./tokens");
var numAuto_1 = require("./numAuto");
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = this.stripFinalNewline(input);
        this.column = 1;
        this.line = 1;
        this.position = 0;
    }
    Lexer.prototype.stripFinalNewline = function (input) {
        var LF = typeof input === "string" ? "\n" : "\n".charCodeAt(0);
        var CR = typeof input === "string" ? "\r" : "\r".charCodeAt(0);
        if (input[input.length - 1] === LF) {
            input = input.slice(0, input.length - 1);
        }
        if (input[input.length - 1] === CR) {
            input = input.slice(0, input.length - 1);
        }
        return input;
    };
    Lexer.prototype.allTokens = function () {
        var token = this.nextToken();
        var tokens = [];
        while (token.getType() !== tokens_1.TokenTypes.EOF) {
            tokens.push(token);
            token = this.nextToken();
            // console.log(token)
        }
        return tokens;
    };
    Lexer.prototype.nextToken = function () {
        if (this.position >= this.input.length) {
            return new tokens_1.Token(tokens_1.TokenTypes.EOF, "", this.line, this.column);
        }
        this.skipWhitespacesAndNewLines();
        var character = this.input.charAt(this.position);
        // console.log(`LOOKING FOR NEW TOKEN AT ${this.position} STARTING WITH ${character}`)
        var token = null;
        if (!token && tokens_1.CharUtils.isLetter(character)) {
            token = this.recognizeIdentifier();
            if (!token) {
                throw new Error('Tokenizer error: unable to find identifier');
            }
        }
        if (!token && tokens_1.CharUtils.isDigit(character)) {
            token = this.recognizeNumber();
            if (!token) {
                throw new Error('Tokenizer error: unable to find number');
            }
        }
        if (!token && character === '"') {
            token = this.recognizeString();
            if (!token) {
                throw new Error('Tokenizer error: unable to find string');
            }
        }
        if (!token && tokens_1.CharUtils.isOperator(character)) {
            token = this.recognizeOperator();
            if (!token) {
                throw new Error('Tokenizer error: unable to find operator');
            }
        }
        if (!token && tokens_1.CharUtils.isParenthesis(character)) {
            token = this.recognizeParenthesis();
            if (!token) {
                throw new Error('Tokenizer error: unable to find parentheses');
            }
        }
        if (!token && tokens_1.CharUtils.isPunctuation(character)) {
            token = this.recognizePunctuation();
            if (!token) {
                throw new Error('Tokenizer error: unable to find punctuations');
            }
        }
        if (!token && tokens_1.CharUtils.isBrace(character)) {
            token = this.recognizeBraces();
            if (!token) {
                throw new Error('Tokenizer error: unable to find braces');
            }
        }
        if (!token && tokens_1.CharUtils.isBracket(character)) {
            token = this.recognizeBrackets();
            if (!token) {
                throw new Error('Tokenizer error: unable to find brackets');
            }
        }
        if (token) {
            return token;
        }
        else {
            throw new Error("Unrecognized character " + character + " " + character.charCodeAt(0) + " at line " + this.line + " and column " + this.column + ".\n        See: " + this.input.split('').slice(this.position - 5, this.position + 5).join(''));
        }
    };
    Lexer.prototype.skipWhitespacesAndNewLines = function () {
        while (this.position < this.input.length &&
            tokens_1.CharUtils.isWhitespaceOrNewLine(this.input.charAt(this.position))) {
            if (tokens_1.CharUtils.isNewLine(this.input.charAt(this.position))) {
                this.line += 1;
                this.column = 1;
            }
            else {
                this.column += 1;
            }
            this.position += 1;
        }
    };
    Lexer.prototype.recognizeParenthesis = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === "(") {
            return new tokens_1.Token(tokens_1.TokenTypes.Lparent, "(", line, column);
        }
        return new tokens_1.Token(tokens_1.TokenTypes.Rparent, ")", line, column);
    };
    Lexer.prototype.recognizeBrackets = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === "[") {
            return new tokens_1.Token(tokens_1.TokenTypes.Lparent, "[", line, column);
        }
        return new tokens_1.Token(tokens_1.TokenTypes.Rparent, "]", line, column);
    };
    Lexer.prototype.recognizePunctuation = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === ";") {
            return new tokens_1.Token(tokens_1.TokenTypes.Semi, ";", line, column);
        }
        return new tokens_1.Token(tokens_1.TokenTypes.Comma, ",", line, column);
    };
    Lexer.prototype.recognizeBraces = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        this.position += 1;
        this.column += 1;
        if (character === "{") {
            return new tokens_1.Token(tokens_1.TokenTypes.Lbrace, "{", line, column);
        }
        return new tokens_1.Token(tokens_1.TokenTypes.Rbrace, "}", line, column);
    };
    Lexer.prototype.recognizeOperator = function () {
        var character = this.input.charAt(this.position);
        if (tokens_1.CharUtils.isComparisonOperator(character)) {
            // console.log("comp op: ", character);
            return this.recognizeComparisonOperator();
        }
        if (tokens_1.CharUtils.isArithmeticOperator(character)) {
            return this.recognizeArithmeticOperator();
        }
        if (tokens_1.CharUtils.isLogicalOperator(character)) {
            return this.recognizeLogicalOperator();
        }
        // ...
    };
    Lexer.prototype.recognizeLogicalOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        var isLookaheadAmpSymbol = lookahead !== null && lookahead === "&";
        var isLookaheadPipeSymbol = lookahead !== null && lookahead === "|";
        this.position += 1;
        this.column += 1;
        if (isLookaheadAmpSymbol || isLookaheadPipeSymbol) {
            this.position += 1;
            this.column += 1;
        }
        else {
            throw new Error("Invalid token " + character);
        }
        switch (character) {
            case "&":
                return new tokens_1.Token(tokens_1.TokenTypes.And, "&&", line, column);
            case "|":
                return new tokens_1.Token(tokens_1.TokenTypes.Or, "||", line, column);
        }
        // ...
    };
    Lexer.prototype.recognizeComparisonOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        // Whether the 'lookahead' character is the equal symbol '='.
        var isLookaheadEqualSymbol = lookahead !== null && lookahead === "=";
        this.position += 1;
        this.column += 1;
        if (isLookaheadEqualSymbol) {
            this.position += 1;
            this.column += 1;
        }
        switch (character) {
            case ">":
                return new tokens_1.Token(tokens_1.TokenTypes.Rt, ">", line, column);
            case "<":
                return new tokens_1.Token(tokens_1.TokenTypes.Lt, "<", line, column);
            case "=":
                return new tokens_1.Token(tokens_1.TokenTypes.Eq, "==", line, column);
            case "!":
                return new tokens_1.Token(tokens_1.TokenTypes.Neq, "!=", line, column);
            default:
                break;
        }
        // ...
    };
    Lexer.prototype.recognizeArithmeticOperator = function () {
        var position = this.position;
        var line = this.line;
        var column = this.column;
        var character = this.input.charAt(position);
        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        var lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
        // Whether the 'lookahead' character is the equal symbol '='.
        var isLookaheadPlusSymbol = lookahead !== null && lookahead === "+";
        var isLookaheadMinusSymbol = lookahead !== null && lookahead === "-";
        this.position += 1;
        this.column += 1;
        if (isLookaheadPlusSymbol || isLookaheadMinusSymbol) {
            this.position += 1;
            this.column += 1;
        }
        switch (character) {
            case "+":
                return new tokens_1.Token(tokens_1.TokenTypes.Plus, "+", line, column);
            case "-":
                return new tokens_1.Token(tokens_1.TokenTypes.Minus, "-", line, column);
            case ".": // Not really an arithmetic op, but fit here so well
                return new tokens_1.Token(tokens_1.TokenTypes.Dot, ".", line, column);
            default:
                break;
        }
    };
    Lexer.prototype.recognizeIdentifier = function () {
        var identifier = "";
        var line = this.line;
        var column = this.column;
        var position = this.position;
        while (position < this.input.length) {
            var character = this.input.charAt(position);
            if (!(tokens_1.CharUtils.isLetter(character) ||
                tokens_1.CharUtils.isDigit(character) ||
                character === "_")) {
                break;
            }
            identifier += character;
            position += 1;
        }
        this.position += identifier.length;
        this.column += identifier.length;
        if (tokens_1.CharUtils.isIdentifierReserved(identifier)) {
            return new tokens_1.Token(identifier, identifier, line, column);
        }
        return new tokens_1.Token(tokens_1.TokenTypes.Identifier, identifier, line, column);
    };
    Lexer.prototype.recognizeNumber = function () {
        var line = this.line;
        var column = this.column;
        // We delegate the building of the FSM to a helper method.
        var fsm = new numAuto_1.NumberAutomata();
        // The input to the FSM will be all the characters from
        // the current position to the rest of the lexer's input.
        var fsmInput = this.input.substring(this.position);
        // Here, in addition of the FSM returning whether a number
        // has been recognized or not, it also returns the number
        // recognized in the 'number' variable. If no number has
        // been recognized, 'number' will be 'null'.
        var _a = fsm.run(fsmInput), recognized = _a.recognized, value = _a.value;
        if (recognized) {
            this.position += value.length;
            this.column += value.length;
            return new tokens_1.Token(tokens_1.TokenTypes.IntegerLiteral, value, line, column);
        }
        // ...
    };
    Lexer.prototype.recognizeString = function () {
        var line = this.line;
        var column = this.column;
        var results = /^["|'][\w ]+["|']/.exec(this.input.substring(this.position));
        if (!results) {
            return new tokens_1.Token(tokens_1.TokenTypes.Unknown, "", line, column);
        }
        this.position += results[0].length;
        this.column += results[0].length;
        return new tokens_1.Token(tokens_1.TokenTypes.StringLiteral, results[0], line, column);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
var text = "import variables \"somevariable\";\nimport strips \"someshit\", \"someshit 2\";\n\ndeclare block SomeBlock \nfrom strip \"someshit\"\nasking \"What the fuck\"\nwith answers {\n  shutUp named \"shut up\" leading to [\n    anotherBlock default with \"somevariable\" + 1,\n    terminate because \"somevariable\" > 10 && thirdBlock.someAnswer\n  ],\n  goAway named \"go away\" leading to [\n    someHeavenlyGivenBlock default,\n    terminate because \"somevariable\" > 10 && thirdBlock.someAnswer\n  ]\n};\n\n-- some comment\ndeclare block AAAAAAAAAAAAaa\nfrom strip \"someshit 2\"\nasking \"What the fuck\"\nwith answers {\n  shutUp named \"shut up\" leading to [\n    anotherBlock default,\n    terminate because \"somevariable\" > 10 && thirdBlock.someAnswer\n  ],\n  goAway named \"go away\" leading to [\n    someHeavenlyGivenBlock default,\n    terminate because \"somevariable\" > 10 && thirdBlock.someAnswer\n  ]\n};\n\nmark block SomeBlock starting;\n";
var l = new Lexer(text);
console.log(l.allTokens());
//# sourceMappingURL=lexer.js.map