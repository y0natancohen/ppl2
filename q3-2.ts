import { map, zipWith } from "ramda";
import { CExp, Parsed, PrimOp, AppExp, LitExp, CompoundExp, makeNumExp, makeStrExp, isBoolExp, makeBoolExp } from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import { makeEmptySExp, isEmptySExp, isCompoundSExp, makeCompoundSExp } from "./imp/L3-value";
import {first, second, rest} from './imp/list';
import { BADFLAGS } from "dns";
import { isNumber, isString, isBoolean } from "util";

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>

    rewriteAllList(exp)



//rewrite single list expression (assuming that it is list!)
//@TODO:  type could be also EmptySExp
export  const rewriteListAppExp = (e: AppExp): AppExp =>
    (e.rands.length === 1) ? makeAppExp(makePrimOp("cons"), [rewriteAllList(first(e.rands)), makeLitExp(makeEmptySExp())]) :
        makeAppExp(makePrimOp("cons"), [ rewriteAllList(first(e.rands)) , rewriteListAppExp(makeAppExp(e.rator ,map(rewriteAllList, rest(e.rands))))]);


//Assume it's already list as CompoundSExp
export  const rewriteListAsCompundExp = (e: any): AppExp =>
    isCompoundSExp(e) ?
        isEmptySExp(e.val2) ? makeAppExp(makePrimOp("cons"), [ SExpToCExp(e.val1) , makeLitExp(makeEmptySExp())]) :
            makeAppExp(makePrimOp("cons"), [SExpToCExp(e.val1), rewriteListAsCompundExp(e.val2) ]) :
        e

export const SExpToCExp = (sexp: any): CExp =>
    isNumber(sexp) ? makeNumExp(sexp) :
        isString(sexp) ? makeStrExp(sexp) :
            isBoolean(sexp) ? makeBoolExp(sexp) :
                rewriteAllList(sexp)


//check is list for CompoundSExp
export const isList = (e: any): e is AppExp =>
    isCompoundSExp(e) ?
        isEmptySExp(e.val2) ? true :
            isList(e.val2) :
        false


export  const rewriteAllList = (cexp: any) : any  =>
    isEmptySExp(cexp) ? cexp :
        isAtomicExp(cexp) ? cexp :
            isError(cexp) ? cexp :
                isProcExp(cexp) ?
                    makeProcExp(cexp.args, map(rewriteAllList, cexp.body)) :
                    isLitExp(cexp) ?
                        (isCompoundSExp(cexp.val) && isList(cexp.val)) ?
                            rewriteListAsCompundExp(cexp.val) :
                            makeLitExp(rewriteAllList(cexp.val)) :
                        isLetExp(cexp) ?
                            makeLetExp( map((b)=>makeBinding(b.var.var ,rewriteAllList(b.val)), cexp.bindings), map(rewriteAllList,cexp.body)) :
                            isProgram(cexp) ?
                                makeProgram(map(rewriteAllList,cexp.exps)) :
                                isDefineExp(cexp) ?
                                    makeDefineExp(cexp.var,rewriteAllList(cexp.val)) :
                                    isIfExp(cexp) ?
                                        makeIfExp(
                                            rewriteAllList(cexp.test),
                                            rewriteAllList(cexp.then),
                                            rewriteAllList(cexp.alt)) :
                                        isAppExp(cexp) ?
                                            (isPrimOp(cexp.rator) && (cexp.rator.op == "list")) ?
                                                rewriteListAppExp(cexp) :
                                                makeAppExp(rewriteAllList(cexp.rator), map(rewriteAllList,cexp.rands)) :
                                            isCompoundSExp(cexp) ?
                                                isList(cexp) ?
                                                    rewriteListAsCompundExp(cexp) :
                                                    makeCompoundSExp(rewriteAllList(cexp.val1), rewriteAllList(cexp.val2)) :

                                                Error("Unexpected expression " + cexp);