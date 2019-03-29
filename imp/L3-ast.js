"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ===========================================================
// AST type models
var ramda_1 = require("ramda");
var L3_value_1 = require("./L3-value");
var list_1 = require("./list");
var p = require("s-expression");
var error_1 = require("./error");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Type value constructors for disjoint types
exports.makeProgram = function (exps) { return ({ tag: "Program", exps: exps }); };
exports.makeDefineExp = function (v, val) {
    return ({ tag: "DefineExp", var: v, val: val });
};
exports.makeNumExp = function (n) { return ({ tag: "NumExp", val: n }); };
exports.makeBoolExp = function (b) { return ({ tag: "BoolExp", val: b }); };
exports.makeStrExp = function (s) { return ({ tag: "StrExp", val: s }); };
exports.makePrimOp = function (op) { return ({ tag: "PrimOp", op: op }); };
exports.makeVarRef = function (v) { return ({ tag: "VarRef", var: v }); };
exports.makeVarDecl = function (v) { return ({ tag: "VarDecl", var: v }); };
exports.makeAppExp = function (rator, rands) {
    return ({ tag: "AppExp", rator: rator, rands: rands });
};
// L2
exports.makeIfExp = function (test, then, alt) {
    return ({ tag: "IfExp", test: test, then: then, alt: alt });
};
exports.makeProcExp = function (args, body) {
    return ({ tag: "ProcExp", args: args, body: body });
};
exports.makeBinding = function (v, val) {
    return ({ tag: "Binding", var: exports.makeVarDecl(v), val: val });
};
exports.makeLetExp = function (bindings, body) {
    return ({ tag: "LetExp", bindings: bindings, body: body });
};
// L3
exports.makeLitExp = function (val) {
    return ({ tag: "LitExp", val: val });
};
// Type predicates for disjoint types
exports.isProgram = function (x) { return x.tag === "Program"; };
exports.isDefineExp = function (x) { return x.tag === "DefineExp"; };
exports.isNumExp = function (x) { return x.tag === "NumExp"; };
exports.isBoolExp = function (x) { return x.tag === "BoolExp"; };
exports.isStrExp = function (x) { return x.tag === "StrExp"; };
exports.isPrimOp = function (x) { return x.tag === "PrimOp"; };
exports.isVarRef = function (x) { return x.tag === "VarRef"; };
exports.isVarDecl = function (x) { return x.tag === "VarDecl"; };
exports.isAppExp = function (x) { return x.tag === "AppExp"; };
// L2
exports.isIfExp = function (x) { return x.tag === "IfExp"; };
exports.isProcExp = function (x) { return x.tag === "ProcExp"; };
exports.isBinding = function (x) { return x.tag === "Binding"; };
exports.isLetExp = function (x) { return x.tag === "LetExp"; };
// L3
exports.isLitExp = function (x) { return x.tag === "LitExp"; };
// Type predicates for type unions
exports.isExp = function (x) { return exports.isDefineExp(x) || exports.isCExp(x); };
exports.isAtomicExp = function (x) {
    return exports.isNumExp(x) || exports.isBoolExp(x) || exports.isStrExp(x) ||
        exports.isPrimOp(x) || exports.isVarRef(x);
};
exports.isCompoundExp = function (x) {
    return exports.isAppExp(x) || exports.isIfExp(x) || exports.isProcExp(x) || exports.isLitExp(x) || exports.isLetExp(x);
};
exports.isCExp = function (x) {
    return exports.isAtomicExp(x) || exports.isCompoundExp(x);
};
// ========================================================
// Parsing utilities
exports.isEmpty = function (x) { return x.length === 0; };
exports.isArray = function (x) { return x instanceof Array; };
exports.isString = function (x) { return typeof x === "string"; };
exports.isNumber = function (x) { return typeof x === "number"; };
exports.isBoolean = function (x) { return typeof x === "boolean"; };
// s-expression returns strings quoted as "a" as [String: 'a'] objects
// to distinguish them from symbols - which are encoded as 'a'
// These are constructed using the new String("a") constructor
// and can be distinguished from regular strings based on the constructor.
exports.isSexpString = function (x) {
    return !exports.isString(x) && x.constructor && x.constructor.name === "String";
};
// A weird method to check that a string is a string encoding of a number
exports.isNumericString = function (x) { return JSON.stringify(+x) === x; };
// List operations similar to car/cdr/cadr in Scheme
exports.first = function (x) { return x[0]; };
exports.second = function (x) { return x[1]; };
exports.rest = function (x) { return x.slice(1); };
// ========================================================
// Parsing
exports.parseL3 = function (x) {
    return exports.parseL3Sexp(p(x));
};
exports.parseL3Sexp = function (sexp) {
    return exports.isEmpty(sexp) ? Error("Parse: Unexpected empty") :
        exports.isArray(sexp) ? parseL3Compound(sexp) :
            exports.isString(sexp) ? parseL3Atomic(sexp) :
                exports.isSexpString(sexp) ? parseL3Atomic(sexp) :
                    Error("Parse: Unexpected type " + sexp);
};
var parseL3Compound = function (sexps) {
    return exports.first(sexps) === "L3" ? parseProgram(ramda_1.map(exports.parseL3Sexp, exports.rest(sexps))) :
        exports.first(sexps) === "define" ?
            error_1.safeF(function (val) { return exports.makeDefineExp(exports.makeVarDecl(sexps[1]), val); })(exports.parseL3CExp(sexps[2])) :
            exports.parseL3CExp(sexps);
};
var parseProgram = function (es) {
    return exports.isEmpty(es) ? Error("Empty program") :
        list_1.allT(exports.isExp, es) ? exports.makeProgram(es) :
            error_1.hasNoError(es) ? Error("Program cannot be embedded in another program - " + es) :
                Error(error_1.getErrorMessages(es));
};
var parseL3Atomic = function (sexp) {
    return sexp === "#t" ? exports.makeBoolExp(true) :
        sexp === "#f" ? exports.makeBoolExp(false) :
            exports.isNumericString(sexp) ? exports.makeNumExp(+sexp) :
                exports.isSexpString(sexp) ? exports.makeStrExp(sexp.toString()) :
                    isPrimitiveOp(sexp) ? exports.makePrimOp(sexp) :
                        exports.makeVarRef(sexp);
};
/*
    ;; <prim-op>  ::= + | - | * | / | < | > | = | not | and | or | eq? | string=?
    ;;                  | cons | car | cdr | pair? | number? | list
    ;;                  | boolean? | symbol? | string?      ##### L3
*/
var isPrimitiveOp = function (x) {
    return x === "+" ||
        x === "-" ||
        x === "*" ||
        x === "/" ||
        x === ">" ||
        x === "<" ||
        x === "=" ||
        x === "not" ||
        x === "and" ||
        x === "or" ||
        x === "eq?" ||
        x === "string=?" ||
        x === "cons" ||
        x === "car" ||
        x === "cdr" ||
        x === "list" ||
        x === "pair?" ||
        x === "number?" ||
        x === "boolean?" ||
        x === "symbol?" ||
        x === "string?";
};
exports.parseL3CExp = function (sexp) {
    return exports.isArray(sexp) ? parseL3CompoundCExp(sexp) :
        exports.isString(sexp) ? parseL3Atomic(sexp) :
            exports.isSexpString(sexp) ? parseL3Atomic(sexp) :
                Error("Unexpected type" + sexp);
};
var parseL3CompoundCExp = function (sexps) {
    return exports.first(sexps) === "if" ? parseIfExp(sexps) :
        exports.first(sexps) === "lambda" ? parseProcExp(sexps) :
            exports.first(sexps) === "let" ? parseLetExp(sexps) :
                exports.first(sexps) === "quote" ? exports.parseLitExp(sexps) :
                    parseAppExp(sexps);
};
var parseAppExp = function (sexps) {
    return error_1.safeFL(function (cexps) { return exports.makeAppExp(exports.first(cexps), exports.rest(cexps)); })(ramda_1.map(exports.parseL3CExp, sexps));
};
var parseIfExp = function (sexps) {
    return error_1.safeFL(function (cexps) { return exports.makeIfExp(cexps[0], cexps[1], cexps[2]); })(ramda_1.map(exports.parseL3CExp, exports.rest(sexps)));
};
var parseProcExp = function (sexps) {
    return error_1.safeFL(function (body) { return exports.makeProcExp(ramda_1.map(exports.makeVarDecl, sexps[1]), body); })(ramda_1.map(exports.parseL3CExp, exports.rest(exports.rest(sexps))));
};
var parseLetExp = function (sexps) {
    var bdgs = sexps[1];
    var vars = ramda_1.map(exports.first, bdgs);
    var vals = ramda_1.map(function (pair) { return exports.parseL3CExp(exports.second(pair)); }, bdgs);
    if (!error_1.hasNoError(vals)) {
        return Error("Bad value in let vars " + bdgs);
    }
    var bindings = ramda_1.zipWith(exports.makeBinding, vars, vals);
    var body = ramda_1.map(exports.parseL3CExp, exports.rest(exports.rest(sexps)));
    if (!error_1.hasNoError(body)) {
        return Error("Parse: Bad let: " + error_1.getErrorMessages(body));
    }
    else {
        return exports.makeLetExp(bindings, body);
    }
};
// sexps has the shape (quote <sexp>)
exports.parseLitExp = function (sexps) {
    return error_1.safeF(exports.makeLitExp)(exports.parseSExp(exports.second(sexps)));
};
exports.isDottedPair = function (sexps) {
    return sexps.length === 3 &&
        sexps[1] === ".";
};
exports.makeDottedPair = function (sexps) {
    return error_1.safeF2(L3_value_1.makeCompoundSExp)(exports.parseSExp(sexps[0]), exports.parseSExp(sexps[2]));
};
// x is the output of p (sexp parser)
exports.parseSExp = function (x) {
    return x === "#t" ? true :
        x === "#f" ? false :
            exports.isNumericString(x) ? +x :
                exports.isSexpString(x) ? x.toString() :
                    exports.isString(x) ? L3_value_1.makeSymbolSExp(x) :
                        x.length === 0 ? L3_value_1.makeEmptySExp() :
                            exports.isDottedPair(x) ? exports.makeDottedPair(x) :
                                exports.isArray(x) ? (
                                // fail on (x . y z)
                                x[0] === '.' ? Error("Bad dotted sexp: " + x) :
                                    error_1.safeF2(L3_value_1.makeCompoundSExp)(exports.parseSExp(exports.first(x)), exports.parseSExp(exports.rest(x)))) :
                                    Error("Bad literal expression: " + x);
};
