import { map } from "ramda";
import { Parsed, AppExp, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isLitExp, isProcExp, isIfExp, isAppExp, isDefineExp, isLetExp, PrimOp, CExp } from './imp/L3-ast';
import {parsedToString} from './imp/L3-value';
import {isError} from './imp/error';

/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l2ToPython = (exp: Parsed | Error): string | Error => 
   @TODO    
