import {map} from "ramda";
import {
    Parsed, AppExp, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isLitExp,
    isProcExp, isIfExp, isAppExp, isDefineExp, isLetExp, PrimOp, CExp
} from './imp/L3-ast';
import {parsedToString} from './imp/L3-value';
import {isError} from './imp/error';

/*
Purpose: return python code from a given L2 AST
Signature: l2ToPython(exp)
Type: [Parsed -> string]
*/
export const l2ToPython = (exp: Parsed | Error): string | Error => {
    return unparse(exp)
};


// unparser for L2 - good reference
export const unparse = (exp: Parsed | Error): string | Error =>
    isError(exp) ? exp.message :
        isProgram(exp) ? map(unparse, exp.exps).join("\n") :
            isBoolExp(exp) ? (exp.val ? 'True' : 'False') :
                isNumExp(exp) ? exp.val.toString() :
                    isVarRef(exp) ? exp.var :
                        isPrimOp(exp) ? exp.op :
                            isDefineExp(exp) ? exp.var.var + " = " + unparse(exp.val) :
                                isProcExp(exp) ? "(" + "lambda " +
                                    map((p) => p.var, exp.args).join(", ") + ": " +
                                    map(unparse, exp.body).join(" ") +
                                    ")" :
                                    isIfExp(exp) ? "(" +
                                        unparse(exp.then) + " if " +
                                        unparse(exp.test) + " else " +
                                        unparse(exp.alt) + ")" :
                                        isAppExp(exp) ?
                                            handleRatorType(exp) :
                                            Error("Unknown expression: " + exp.tag);

export const handleRatorType = (exp: AppExp): string | Error =>
    (exp.rands === undefined || exp.rands.length == 0) ?
        "(" + unparse(exp.rator) + ")" :
        exp.rands.length == 1 ?
            isVarRef(exp.rator) || isProcExp(exp.rator) || isAppExp(exp.rator) ?
                unparse(exp.rator) + "(" + map(unparse, exp.rands) + ")" :
                "(" + unparse(exp.rator) + " " + map(unparse, exp.rands) + ")" :
            exp.rands.length > 1 ?
                isVarRef(exp.rator) || isProcExp(exp.rator) || isAppExp(exp.rator) ?
                    unparse(exp.rator) + "(" + map(unparse, exp.rands).join(",") + ")" :
                    "(" + map(unparse, exp.rands).join(" " + unparse(exp.rator) + " ") + ")" :
                Error("Unknown expression: " + exp.tag);
