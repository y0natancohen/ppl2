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
    parseL3Sexp, parseL3
} from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isExp, isStrExp, isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import {makeEmptySExp, isEmptySExp, isCompoundSExp, parsedToString, makeCompoundSExp} from "./imp/L3-value";
import {first, second, rest} from './imp/list';

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
    isExp(exp) ? rewriteAllListExp(exp) :
        isProgram(exp) ? makeProgram(map(rewriteAllListExp, exp.exps)) :
            exp;

const rewriteAllListExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllListCExp(exp) :
        isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllListCExp(exp.val)) :
            exp;

const rewriteAllListCExp = (exp: CExp): CExp =>
    isLitExp(exp) ? rewriteLitExp(exp) :
        isIfExp(exp) ? makeIfExp(rewriteAllListCExp(exp.test),
            rewriteAllListCExp(exp.then),
            rewriteAllListCExp(exp.alt)) :
            isAppExp(exp) ? rewriteAppExp(exp) :
                isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllListCExp, exp.body)) :
                    isLetExp(exp) ? rewriteAllListCExp(exp) :
                        exp;

const rewriteAppExp = (e: AppExp): AppExp | LitExp => {
    if (isPrimOp(e.rator)){
        if (e.rator.op === 'list'){
            if (e.rands.length === 0){
                return makeLitExp('()')
            }else{
                return makeAppExp(
                    makePrimOp('cons'),
                        [e.rands[0],
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
        const val1CExp = parseL3CExp(e.val.val1);
        if (isCExp(val1CExp) && isCompoundSExp(e.val.val2)){
            return makeAppExp(
                    makePrimOp('cons'),
                    [val1CExp, rewriteLitExp(makeLitExp(e.val.val2))]
            )
        }else return e
    }
};


