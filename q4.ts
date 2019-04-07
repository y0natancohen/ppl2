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
    return isError(exp) ? exp.message :
        isProgram(exp) ? map(l2ToPython, exp.exps).join("\n") :
            isBoolExp(exp) ? (exp.val ? 'True' : 'False') :
                isNumExp(exp) ? exp.val.toString() :
                    isVarRef(exp) ? exp.var :
                        isPrimOp(exp) ? correctOp(exp.op) :
                            isDefineExp(exp) ? exp.var.var + " = " + l2ToPython(exp.val) :
                                isProcExp(exp) ? "(" + "lambda " +
                                    map((p) => p.var, exp.args).join(", ") + ": " +
                                    map(l2ToPython, exp.body).join(" ") +
                                    ")" :
                                    isIfExp(exp) ? "(" +
                                        l2ToPython(exp.then) + " if " +
                                        l2ToPython(exp.test) + " else " +
                                        l2ToPython(exp.alt) + ")" :
                                        isAppExp(exp) ? handleRatorType(exp) :
                                            Error("Unknown expression: " + exp.tag)
};

const correctOp = (op: string) : string =>{
    return (op === '=')? '==' : op
};

export const handleRatorType = (exp: AppExp): string | Error =>
    (exp.rands === undefined || exp.rands.length == 0) ?
        "(" + l2ToPython(exp.rator) + ")" :
        exp.rands.length == 1 ?
            isVarRef(exp.rator) || isProcExp(exp.rator) || isAppExp(exp.rator) ?
                l2ToPython(exp.rator) + "(" + map(l2ToPython, exp.rands) + ")" :
                "(" + l2ToPython(exp.rator) + " " + map(l2ToPython, exp.rands) + ")" :
            exp.rands.length > 1 ?
                isVarRef(exp.rator) || isProcExp(exp.rator) || isAppExp(exp.rator) ?
                    l2ToPython(exp.rator) + "(" + map(l2ToPython, exp.rands).join(",") + ")" :
                    "(" + map(l2ToPython, exp.rands).join(" " + l2ToPython(exp.rator) + " ") + ")" :
                Error("Unknown expression: " + exp.tag);
