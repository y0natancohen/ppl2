import { map, zipWith } from "ramda";
import { CExp, Parsed, PrimOp, AppExp, LitExp } from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import { makeEmptySExp, isEmptySExp, isCompoundSExp } from "./imp/L3-value";
import {first, second, rest} from './imp/list';

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
   @TODO
