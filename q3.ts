import { map, zipWith } from "ramda";
import {
    CExp,
    Exp,
    Parsed,
    PrimOp,
    AppExp,
    LitExp,
    isBoolExp,
    isNumExp,
    isVarRef,
    parseL3CExp,
    parseL3Sexp, parseL3, makeNumExp
} from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isExp, isStrExp, isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import {makeEmptySExp, isEmptySExp, isCompoundSExp, parsedToString, makeCompoundSExp, EmptySExp} from "./imp/L3-value";
import {first, second, rest} from './imp/list';

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
    isExp(exp) ? rewriteExp(exp) :
        isProgram(exp) ? makeProgram(map(rewriteExp, exp.exps)) :
            exp;

const rewriteExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteCExp(exp) :
        isDefineExp(exp) ? makeDefineExp(exp.var, rewriteCExp(exp.val)) :
            exp;

const rewriteCExp = (exp: CExp): CExp =>
    isLitExp(exp) ? rewriteLitExp(exp) :
        isIfExp(exp) ? makeIfExp(rewriteCExp(exp.test),
            rewriteCExp(exp.then),
            rewriteCExp(exp.alt)) :
            isAppExp(exp) ? rewriteAppExp(exp) :
                isProcExp(exp) ? makeProcExp(exp.args, map(rewriteCExp, exp.body)) :
                    isLetExp(exp) ? rewriteCExp(exp) :
                        exp;

const rewriteAppExp = (e: AppExp): AppExp | LitExp => {
    if (isPrimOp(e.rator)){
        if (e.rator.op === 'list'){
            if (e.rands.length === 0){
                return makeLitExp(makeEmptySExp());
            }else{
                return makeAppExp(
                    makePrimOp('cons'),
                        [rewriteCExp(e.rands[0]),
                        rewriteAppExp(makeAppExp(e.rator, e.rands.slice(1)))]
                )
            }
        }else return e;
    } else return e;
};

const rewriteLitExp = (e: LitExp): LitExp | AppExp => {
    if (isEmptySExp(e.val)){
        return e
    }else if (isCompoundSExp(e.val)){
        const val1 = e.val.val1;
        if (typeof val1 === "number"){
            const val1Exp = makeNumExp(val1);
        }
        const val1CExp = parseL3CExp(e.val.val1); // this produces error because 1 is not a valid sexp
        const val2isCompoundSExp = isCompoundSExp(e.val.val2);
        const val1isCExp = isCExp(val1CExp);
        if (isCExp(val1CExp) && isCompoundSExp(e.val.val2)){
            const what_came_back = rewriteLitExp(makeLitExp(e.val.val2));
            return makeAppExp(
                    makePrimOp('cons'),
                    [val1CExp, rewriteLitExp(makeLitExp(e.val.val2))]
            )
        }else return e
    }
};


