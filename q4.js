"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var error_1 = require("./imp/error");
/*
Purpose: return python code from a given L2 AST
Signature: l2ToPython(exp)
Type: [Parsed -> string]
*/
exports.l2ToPython = function (exp) {
    return exports.unparse(exp);
};
// unparser for L2 - good reference
exports.unparse = function (exp) {
    return error_1.isError(exp) ? exp.message :
        L3_ast_1.isProgram(exp) ? ramda_1.map(exports.unparse, exp.exps).join("\n") :
            L3_ast_1.isBoolExp(exp) ? (exp.val ? 'True' : 'False') :
                L3_ast_1.isNumExp(exp) ? exp.val.toString() :
                    L3_ast_1.isVarRef(exp) ? exp.var :
                        L3_ast_1.isPrimOp(exp) ? exp.op :
                            L3_ast_1.isDefineExp(exp) ? exp.var.var + " = " + exports.unparse(exp.val) :
                                L3_ast_1.isProcExp(exp) ? "(" + "lambda " +
                                    ramda_1.map(function (p) { return p.var; }, exp.args).join(", ") + ": " +
                                    ramda_1.map(exports.unparse, exp.body).join(" ") +
                                    ")" :
                                    L3_ast_1.isIfExp(exp) ? "(" +
                                        exports.unparse(exp.then) + " if " +
                                        exports.unparse(exp.test) + " else " +
                                        exports.unparse(exp.alt) + ")" :
                                        L3_ast_1.isAppExp(exp) ?
                                            exports.handleRatorType(exp) :
                                            Error("Unknown expression: " + exp.tag);
};
exports.handleRatorType = function (exp) {
    return (exp.rands === undefined || exp.rands.length == 0) ?
        "(" + exports.unparse(exp.rator) + ")" :
        exp.rands.length == 1 ?
            L3_ast_1.isVarRef(exp.rator) || L3_ast_1.isProcExp(exp.rator) || L3_ast_1.isAppExp(exp.rator) ?
                exports.unparse(exp.rator) + "(" + ramda_1.map(exports.unparse, exp.rands) + ")" :
                "(" + exports.unparse(exp.rator) + " " + ramda_1.map(exports.unparse, exp.rands) + ")" :
            exp.rands.length > 1 ?
                L3_ast_1.isVarRef(exp.rator) || L3_ast_1.isProcExp(exp.rator) || L3_ast_1.isAppExp(exp.rator) ?
                    exports.unparse(exp.rator) + "(" + ramda_1.map(exports.unparse, exp.rands).join(",") + ")" :
                    "(" + ramda_1.map(exports.unparse, exp.rands).join(" " + exports.unparse(exp.rator) + " ") + ")" :
                Error("Unknown expression: " + exp.tag);
};
