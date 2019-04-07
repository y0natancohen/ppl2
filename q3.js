"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var L3_ast_2 = require("./imp/L3-ast");
var L3_ast_3 = require("./imp/L3-ast");
var L3_value_1 = require("./imp/L3-value");
/*
Purpose: transforms a L3 AST (abstrcat syntax tree) to a L30 AST.
L30 is defined as L3 excluding the ​list ​ primitive operation and the literal expression for lists.

Signature: l3ToL30(exp)

Type: [Parsed -> Parsed]
*/
exports.l3ToL30 = function (exp) {
    return L3_ast_3.isExp(exp) ? rewriteExp(exp) :
        L3_ast_3.isProgram(exp) ? L3_ast_2.makeProgram(ramda_1.map(rewriteExp, exp.exps)) :
            exp;
};
var rewriteExp = function (exp) {
    return L3_ast_3.isCExp(exp) ? rewriteCExp(exp) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_2.makeDefineExp(exp.var, rewriteCExp(exp.val)) :
            exp;
};
var rewriteBinding = function (b) {
    return L3_ast_2.makeBinding(b.var.var, rewriteCExp(b.val));
};
var rewriteCExp = function (exp) {
    return L3_ast_3.isLitExp(exp) ? rewriteLitExp(exp) :
        L3_ast_3.isIfExp(exp) ? L3_ast_2.makeIfExp(rewriteCExp(exp.test), rewriteCExp(exp.then), rewriteCExp(exp.alt)) :
            L3_ast_3.isAppExp(exp) ? rewriteAppExp(exp) :
                L3_ast_3.isProcExp(exp) ? L3_ast_2.makeProcExp(exp.args, ramda_1.map(rewriteCExp, exp.body)) :
                    L3_ast_3.isLetExp(exp) ? L3_ast_2.makeLetExp(ramda_1.map(rewriteBinding, exp.bindings), ramda_1.map(rewriteCExp, exp.body)) :
                        exp;
};
var rewriteAppExp = function (e) {
    if (L3_ast_3.isPrimOp(e.rator) && e.rator.op === 'list') {
        if (e.rands.length === 0) {
            return L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp());
        }
        else {
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(e.rands[0]),
                // map(rewriteAppExp, e.rands.slice(1)))]
                rewriteAppExp(L3_ast_2.makeAppExp(e.rator, e.rands.slice(1)))]);
        }
    }
    else if (L3_ast_3.isProcExp(e.rator)) {
        return L3_ast_2.makeAppExp(L3_ast_2.makeProcExp(e.rator.args, ramda_1.map(rewriteCExp, e.rator.body)), ramda_1.map(rewriteCExp, e.rands));
    }
    else {
        return L3_ast_2.makeAppExp(e.rator, ramda_1.map(rewriteCExp, e.rands));
    }
};
var makeCexpFromVal1 = function (val1) {
    if (L3_ast_1.isNumber(val1)) {
        return L3_ast_1.makeNumExp(val1);
    }
    else if (L3_ast_1.isBoolean(val1)) {
        return L3_ast_1.makeBoolExp(val1);
    }
    else if (L3_ast_1.isString(val1)) {
        return L3_ast_1.makeStrExp(val1);
    }
    else if (L3_value_1.isSymbolSExp(val1)) {
        return L3_ast_2.makeLitExp(val1);
    }
    else if (L3_value_1.isCompoundSExp(val1)) {
        return rewriteLitExp(L3_ast_2.makeLitExp(val1));
    }
    else {
        return L3_ast_2.makeLitExp(val1);
    }
};
var rewriteLitExp = function (e) {
    if (L3_value_1.isEmptySExp(e.val)) {
        return L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp());
    }
    else if (L3_value_1.isCompoundSExp(e.val)) { // list
        var val1 = e.val.val1;
        var val2 = e.val.val2;
        var val1CExp = makeCexpFromVal1(val1);
        if (L3_value_1.isEmptySExp(val2)) { // last in list
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(val1CExp), L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp())]);
        }
        else { // middle of list
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(val1CExp), rewriteLitExp(L3_ast_2.makeLitExp(val2))]);
        }
    }
    else {
        return e;
    }
};
