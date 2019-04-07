"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var L3_ast_2 = require("./imp/L3-ast");
var L3_ast_3 = require("./imp/L3-ast");
var error_1 = require("./imp/error");
var L3_value_1 = require("./imp/L3-value");
var list_1 = require("./imp/list");
var util_1 = require("util");
/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
exports.l3ToL30 = function (exp) {
    return exports.rewriteAllList(exp);
};
//rewrite single list expression (assuming that it is list!)
//@TODO:  type could be also EmptySExp
exports.rewriteListAppExp = function (e) {
    return (e.rands.length === 1) ? L3_ast_2.makeAppExp(L3_ast_2.makePrimOp("cons"), [exports.rewriteAllList(list_1.first(e.rands)), L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp())]) :
        L3_ast_2.makeAppExp(L3_ast_2.makePrimOp("cons"), [exports.rewriteAllList(list_1.first(e.rands)), exports.rewriteListAppExp(L3_ast_2.makeAppExp(e.rator, ramda_1.map(exports.rewriteAllList, list_1.rest(e.rands))))]);
};
//Assume it's already list as CompoundSExp
exports.rewriteListAsCompundExp = function (e) {
    return L3_value_1.isCompoundSExp(e) ?
        L3_value_1.isEmptySExp(e.val2) ? L3_ast_2.makeAppExp(L3_ast_2.makePrimOp("cons"), [exports.SExpToCExp(e.val1), L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp())]) :
            L3_ast_2.makeAppExp(L3_ast_2.makePrimOp("cons"), [exports.SExpToCExp(e.val1), exports.rewriteListAsCompundExp(e.val2)]) :
        e;
};
exports.SExpToCExp = function (sexp) {
    return util_1.isNumber(sexp) ? L3_ast_1.makeNumExp(sexp) :
        util_1.isString(sexp) ? L3_ast_1.makeStrExp(sexp) :
            util_1.isBoolean(sexp) ? L3_ast_1.makeBoolExp(sexp) :
                exports.rewriteAllList(sexp);
};
//check is list for CompoundSExp
exports.isList = function (e) {
    return L3_value_1.isCompoundSExp(e) ?
        L3_value_1.isEmptySExp(e.val2) ? true :
            exports.isList(e.val2) :
        false;
};
exports.rewriteAllList = function (cexp) {
    return L3_value_1.isEmptySExp(cexp) ? cexp :
        L3_ast_3.isAtomicExp(cexp) ? cexp :
            error_1.isError(cexp) ? cexp :
                L3_ast_3.isProcExp(cexp) ?
                    L3_ast_2.makeProcExp(cexp.args, ramda_1.map(exports.rewriteAllList, cexp.body)) :
                    L3_ast_3.isLitExp(cexp) ?
                        (L3_value_1.isCompoundSExp(cexp.val) && exports.isList(cexp.val)) ?
                            exports.rewriteListAsCompundExp(cexp.val) :
                            L3_ast_2.makeLitExp(exports.rewriteAllList(cexp.val)) :
                        L3_ast_3.isLetExp(cexp) ?
                            L3_ast_2.makeLetExp(ramda_1.map(function (b) { return L3_ast_2.makeBinding(b.var.var, exports.rewriteAllList(b.val)); }, cexp.bindings), ramda_1.map(exports.rewriteAllList, cexp.body)) :
                            L3_ast_3.isProgram(cexp) ?
                                L3_ast_2.makeProgram(ramda_1.map(exports.rewriteAllList, cexp.exps)) :
                                L3_ast_3.isDefineExp(cexp) ?
                                    L3_ast_2.makeDefineExp(cexp.var, exports.rewriteAllList(cexp.val)) :
                                    L3_ast_3.isIfExp(cexp) ?
                                        L3_ast_2.makeIfExp(exports.rewriteAllList(cexp.test), exports.rewriteAllList(cexp.then), exports.rewriteAllList(cexp.alt)) :
                                        L3_ast_3.isAppExp(cexp) ?
                                            (L3_ast_3.isPrimOp(cexp.rator) && (cexp.rator.op == "list")) ?
                                                exports.rewriteListAppExp(cexp) :
                                                L3_ast_2.makeAppExp(exports.rewriteAllList(cexp.rator), ramda_1.map(exports.rewriteAllList, cexp.rands)) :
                                            L3_value_1.isCompoundSExp(cexp) ?
                                                exports.isList(cexp) ?
                                                    exports.rewriteListAsCompundExp(cexp) :
                                                    L3_value_1.makeCompoundSExp(exports.rewriteAllList(cexp.val1), exports.rewriteAllList(cexp.val2)) :
                                                Error("Unexpected expression " + cexp);
};
