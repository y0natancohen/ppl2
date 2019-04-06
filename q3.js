"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var L3_ast_2 = require("./imp/L3-ast");
var L3_ast_3 = require("./imp/L3-ast");
var L3_value_1 = require("./imp/L3-value");
/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
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
var rewriteCExp = function (exp) {
    return L3_ast_3.isLitExp(exp) ? rewriteLitExp(exp) :
        L3_ast_3.isIfExp(exp) ? L3_ast_2.makeIfExp(rewriteCExp(exp.test), rewriteCExp(exp.then), rewriteCExp(exp.alt)) :
            L3_ast_3.isAppExp(exp) ? rewriteAppExp(exp) :
                L3_ast_3.isProcExp(exp) ? L3_ast_2.makeProcExp(exp.args, ramda_1.map(rewriteCExp, exp.body)) :
                    L3_ast_3.isLetExp(exp) ? rewriteCExp(exp) :
                        exp;
};
var rewriteAppExp = function (e) {
    if (L3_ast_3.isPrimOp(e.rator)) {
        if (e.rator.op === 'list') {
            if (e.rands.length === 0) {
                return L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp());
            }
            else {
                return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(e.rands[0]),
                    rewriteAppExp(L3_ast_2.makeAppExp(e.rator, e.rands.slice(1)))]);
            }
        }
        else
            return e;
    }
    else
        return e;
};
var rewriteLitExp = function (e) {
    if (L3_value_1.isEmptySExp(e.val)) {
        return e;
    }
    else if (L3_value_1.isCompoundSExp(e.val)) {
        var val1 = e.val.val1;
        if (typeof val1 === "number") {
            var val1Exp = L3_ast_1.makeNumExp(val1);
        }
        var val1CExp = L3_ast_1.parseL3CExp(e.val.val1); // this produces error because 1 is not a valid sexp
        var val2isCompoundSExp = L3_value_1.isCompoundSExp(e.val.val2);
        var val1isCExp = L3_ast_3.isCExp(val1CExp);
        if (L3_ast_3.isCExp(val1CExp) && L3_value_1.isCompoundSExp(e.val.val2)) {
            var what_came_back = rewriteLitExp(L3_ast_2.makeLitExp(e.val.val2));
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [val1CExp, rewriteLitExp(L3_ast_2.makeLitExp(e.val.val2))]);
        }
        else
            return e;
    }
};
