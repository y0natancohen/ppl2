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
    return L3_ast_3.isExp(exp) ? rewriteAllListExp(exp) :
        L3_ast_3.isProgram(exp) ? L3_ast_2.makeProgram(ramda_1.map(rewriteAllListExp, exp.exps)) :
            exp;
};
var rewriteAllListExp = function (exp) {
    return L3_ast_3.isCExp(exp) ? rewriteAllListCExp(exp) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_2.makeDefineExp(exp.var, rewriteAllListCExp(exp.val)) :
            exp;
};
var rewriteAllListCExp = function (exp) {
    return L3_ast_3.isLitExp(exp) ? rewriteLitExp(exp) :
        L3_ast_3.isIfExp(exp) ? L3_ast_2.makeIfExp(rewriteAllListCExp(exp.test), rewriteAllListCExp(exp.then), rewriteAllListCExp(exp.alt)) :
            L3_ast_3.isAppExp(exp) ? rewriteAppExp(exp) :
                L3_ast_3.isProcExp(exp) ? L3_ast_2.makeProcExp(exp.args, ramda_1.map(rewriteAllListCExp, exp.body)) :
                    L3_ast_3.isLetExp(exp) ? rewriteAllListCExp(exp) :
                        exp;
};
var rewriteAppExp = function (e) {
    if (L3_ast_3.isPrimOp(e.rator)) {
        if (e.rator.op === 'list') {
            if (e.rands.length === 0) {
                return L3_ast_2.makeLitExp('()');
            }
            else {
                return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [e.rands[0],
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
        var val1CExp = L3_ast_1.parseL3CExp(e.val.val1);
        if (L3_ast_3.isCExp(val1CExp) && L3_value_1.isCompoundSExp(e.val.val2)) {
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [val1CExp, rewriteLitExp(L3_ast_2.makeLitExp(e.val.val2))]);
        }
        else
            return e;
    }
};
