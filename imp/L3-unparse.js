"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./L3-ast");
var L3_value_1 = require("./L3-value");
var error_1 = require("./error");
exports.unparseL3 = function (exp) {
    return error_1.isError(exp) ? exp.message :
        L3_ast_1.isProgram(exp) ? ramda_1.map(exports.unparseL3, exp.exps).join("\n") :
            L3_ast_1.isBoolExp(exp) ? (exp.val ? '#t' : '#f') :
                L3_ast_1.isNumExp(exp) ? exp.val.toString() :
                    L3_ast_1.isStrExp(exp) ? exp.val :
                        L3_ast_1.isVarRef(exp) ? exp.var :
                            L3_ast_1.isPrimOp(exp) ? exp.op :
                                L3_ast_1.isLitExp(exp) ? L3_value_1.parsedToString(exp.val) :
                                    L3_ast_1.isDefineExp(exp) ? "(define " + exp.var.var + " " + exports.unparseL3(exp.val) + ")" :
                                        L3_ast_1.isProcExp(exp) ? "(" + "lambda (" +
                                            ramda_1.map(function (p) { return p.var; }, exp.args).join(" ") + ") " +
                                            ramda_1.map(exports.unparseL3, exp.body).join(" ") +
                                            ")" :
                                            L3_ast_1.isIfExp(exp) ? "(" + "if " +
                                                exports.unparseL3(exp.test) + " " +
                                                exports.unparseL3(exp.then) + " " +
                                                exports.unparseL3(exp.alt) +
                                                ")" :
                                                L3_ast_1.isAppExp(exp) ? "(" +
                                                    exports.unparseL3(exp.rator) + " " +
                                                    ramda_1.map(exports.unparseL3, exp.rands).join(" ") +
                                                    ")" :
                                                    L3_ast_1.isLetExp(exp) ? "(" + "let (" +
                                                        ramda_1.map(function (binding) { return "(" + binding.var.var + " " + exports.unparseL3(binding.val) + ")"; }, exp.bindings).join(" ") + ") " +
                                                        ramda_1.map(exports.unparseL3, exp.body).join(" ") +
                                                        ")" :
                                                        Error("Unknown expression: " + exp);
};
