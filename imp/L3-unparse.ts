import { map } from "ramda";
import { Parsed, isStrExp, isBoolExp, isProgram, isNumExp, isVarRef, isPrimOp, isLitExp, isProcExp, isIfExp, isAppExp, isDefineExp, isLetExp } from './L3-ast';
import {parsedToString} from './L3-value';
import {isError} from './error';


export const unparseL3 = (exp: Parsed | Error): string | Error =>
    isError(exp) ? exp.message :
    isProgram(exp) ? map(unparseL3,exp.exps).join("\n") :
    isBoolExp(exp) ? (exp.val ? '#t' : '#f') :
    isNumExp(exp) ? exp.val.toString() :
    isStrExp(exp) ? exp.val :
    isVarRef(exp) ? exp.var :
    isPrimOp(exp) ? exp.op :
    isLitExp(exp) ? parsedToString(exp.val) :
    isDefineExp(exp) ? "(define " + exp.var.var + " " + unparseL3(exp.val) + ")" :
    isProcExp(exp) ? "(" + "lambda (" +  
                          map((p) => p.var, exp.args).join(" ") + ") " + 
                          map(unparseL3, exp.body).join(" ") + 
                     ")" :
    isIfExp(exp) ? "(" + "if " + 
                        unparseL3(exp.test) + " " + 
                        unparseL3(exp.then) + " " + 
                        unparseL3(exp.alt) + 
                   ")" :
    isAppExp(exp) ? "(" + 
                          unparseL3(exp.rator) + " " + 
                          map(unparseL3, exp.rands).join(" ") + 
                     ")" :
    isLetExp(exp) ? "(" + "let (" +
                            map((binding) => "(" + binding.var.var + " " + unparseL3(binding.val) + ")", exp.bindings).join(" ") + ") " +
                            map(unparseL3, exp.body).join(" ") +                        
                    ")" :
    Error("Unknown expression: " + exp);