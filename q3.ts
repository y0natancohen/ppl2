import p = require("s-expression");
import { map, zipWith } from "ramda";
import {
    CExp,
    Exp,
    Parsed,
    PrimOp,
    AppExp,
    LitExp,
    isNumber,
    isString,
    isBoolean,
    isArray,
    isEmpty,
    isBoolExp,
    isNumExp,
    isVarRef,
    parseL3CExp,
    parseL3Sexp, parseL3, makeNumExp, Program, DefineExp, makeVarDecl, makeBoolExp, makeStrExp, Binding
} from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isExp, isStrExp, isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError, safeF} from './imp/error';
import {
    makeEmptySExp,
    isEmptySExp,
    isCompoundSExp,
    parsedToString,
    makeCompoundSExp,
    EmptySExp,
    CompoundSExp, isSymbolSExp, Closure, SymbolSExp, makeSymbolSExp
} from "./imp/L3-value";
import {first, second, rest} from './imp/list';
import {unparseL3} from "./imp/L3-unparse";

/*
Purpose: transforms a L3 AST (abstrcat syntax tree) to a L30 AST.
L30 is defined as L3 excluding the ​list ​ primitive operation and the literal expression for lists.

Signature: l3ToL30(exp)

Type: [Parsed -> Parsed]
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
    isExp(exp) ? rewriteExp(exp) :
        isProgram(exp) ? makeProgram(map(rewriteExp, exp.exps)) :
            exp;

const rewriteExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteCExp(exp) :
        isDefineExp(exp) ? makeDefineExp(exp.var, rewriteCExp(exp.val)) :
            exp;

const rewriteBinding = (b: Binding): Binding =>{
    return makeBinding(b.var.var, rewriteCExp(b.val))
};

const rewriteCExp = (exp: CExp): CExp =>
    isLitExp(exp) ? rewriteLitExp(exp) :
        isIfExp(exp) ? makeIfExp(rewriteCExp(exp.test),
            rewriteCExp(exp.then),
            rewriteCExp(exp.alt)) :
            isAppExp(exp) ? rewriteAppExp(exp) :
                isProcExp(exp) ? makeProcExp(exp.args, map(rewriteCExp, exp.body)) :
                    isLetExp(exp) ? makeLetExp(map(rewriteBinding, exp.bindings),map(rewriteCExp, exp.body)) :
                        exp;

const rewriteAppExp = (e: AppExp): AppExp | LitExp => {
    if (isPrimOp(e.rator) && e.rator.op === 'list'){
        if (e.rands.length === 0){
            return makeLitExp(makeEmptySExp());
        }else{
            return makeAppExp(
                makePrimOp('cons'),
                    [rewriteCExp(e.rands[0]),
                        // map(rewriteAppExp, e.rands.slice(1)))]
                    rewriteAppExp(makeAppExp(e.rator, e.rands.slice(1)))]
            )
        }
    } else if (isProcExp(e.rator)) {

        return makeAppExp(makeProcExp(e.rator.args, map(rewriteCExp, e.rator.body)), map(rewriteCExp, e.rands))

    } else {
        return  makeAppExp(e.rator, map(rewriteCExp, e.rands));
    }
};

// const parseL3Compound = (sexps: any[]): Program | DefineExp | CExp | Error =>
//     first(sexps) === "define" ?
//         safeF((val: CExp) => makeDefineExp(makeVarDecl(sexps[1]), val))(parseL3CExp(sexps[2])) :
//         parseL3CExp(sexps);

//
// const rewriteLitExp1 = (e: LitExp): LitExp | AppExp => {
//     if (isEmptySExp(e.val)){
//         return e
//     }else if (isCompoundSExp(e.val)){
//         const val1 = e.val.val1;
//
//         // const val1CExp = parseL3CExp(e.val.val1); // this produces error because 1 is not a valid sexp
//         // const val2isCompoundSExp = isCompoundSExp(e.val.val2);
//         // const val1isCExp = isCExp(val1CExp);
//         // if (isCExp(val1CExp) && isCompoundSExp(e.val.val2)){
//         if (isCompoundSExp(e.val.val2)){
//             const unparsed = unparseL3(e);
//             const sexp = p(unparsed);
//             if (isArray(sexp)){
//                 const sexps = sexp;
//                 if (sexps.length > 0){
//                     const first = sexps[0];
//                     if (first === "quote"){
//
//                     }
//                 }
//                 const exp = parseL3Compound(sexps);
//                 if (isCExp(exp)){
//                     const cexp = exp;
//
//                 }
//             }
//
//
//             const what_came_back = rewriteLitExp1(makeLitExp(e.val.val2));
//             return makeAppExp(
//                 makePrimOp('cons'),
//                 [val1CExp, rewriteLitExp1(makeLitExp(e.val.val2))]
//             )
//         }else return e
//     }
// };

// const litteralStringToDifferentLiteral = (compExp: CompoundSExp): LitExp => {
//     if (isCompoundSExp(compExp.val1)){
//         if (isSymbolSExp(compExp.val1.val1) && compExp.val1.val1.val === 'quote'){
//             return makeLitExp({ tag: 'SymbolSExp', val: 'aaa' })
//         }
//     }
//   ;

const isPrimitiveOp = (x: string): boolean =>
    x === "+" ||
    x === "-" ||
    x === "*" ||
    x === "/" ||
    x === ">" ||
    x === "<" ||
    x === "=" ||
    x === "not" ||
    x === "and" ||
    x === "or" ||
    x === "eq?" ||
    x === "string=?" ||
    x === "cons" ||
    x === "car" ||
    x === "cdr" ||
    x === "list" ||
    x === "pair?" ||
    x === "number?" ||
    x === "boolean?" ||
    x === "symbol?" ||
    x === "string?";



const rewriteLitExp = (e: LitExp): AppExp | LitExp => {
    if (isEmptySExp(e.val)) {
        return makeLitExp(makeEmptySExp())
    } else if (isCompoundSExp(e.val)){ // list
        const val1 = e.val.val1;
        const val2 = e.val.val2;

        // number | boolean | string | PrimOp | Closure | SymbolSExp | EmptySExp | CompoundSExp
        let val1CExp;
        if (isNumber(val1)) {
            val1CExp = makeNumExp(val1)
        }else if (isBoolean(val1)){
            val1CExp = makeBoolExp(val1)
        }else if (isString(val1)){
            val1CExp = makeStrExp(val1)
        } else if (isSymbolSExp(val1)){
            val1CExp = makeLitExp(val1);
                    // if (isPrimitiveOp(val1.val)){
                    //     val1CExp = makePrimOp(val1.val)
                    // } else if (val1.val === "quote"){
                    //     if (isCompoundSExp(val2)){
                    //         if (isSymbolSExp(val2.val1)){
                    //             val1CExp = makeLitExp(makeSymbolSExp(val2.val1.val))
                    //         }else if(isEmptySExp(val2.val1)){
                    //             // return Error('not a good')
                    //             val1CExp = makeLitExp(makeEmptySExp())
                    //         } else {
                    //             // val1CExp = makeNumExp(1); // delete this
                    //             return Error('not a good')
                    //         }
                    //     }else {
                    //         return Error('not a good')
                    //         // val1CExp = makeNumExp(1); // delete this
                    //     }
                    // }else{
                    //     return Error('not a good')
                    //     // makeNumExp(1)
                    // }
        } else if (isCompoundSExp(val1)) {
            val1CExp = rewriteLitExp(makeLitExp(val1))
        }else{
            // val1CExp = makeNumExp(1); // delete this
            val1CExp = makeLitExp(val1);
            // return Error('not a good')
        }
        // const val1CExp = (isNumber(val1))?  makeNumExp(val1) :
        //     ? makeBoolExp(val1):
        //         ? :
        //             // (isPrimOp())? : cant happen i think
        //             (isSymbolSExp(val1))?
        //                 (isPrimitiveOp(val1.val))? makePrimOp(val1.val) :
        //                     (val1.val === "quote")? makeSymbolSExp(val2.val1.val): makeLitExp(val1):
        //         makeLitExp(val1);
        // console.log(JSON.stringify(val1CExp));
        if (isCExp(val1CExp)){

            if (isEmptySExp(val2)){ // last in list
                return makeAppExp(makePrimOp('cons'),
                    [rewriteCExp(val1CExp), makeLitExp(makeEmptySExp())]
                )
            } else { // middle of list
                return makeAppExp(makePrimOp('cons'),
                    [rewriteCExp(val1CExp), rewriteLitExp(makeLitExp(val2))]
                )
            }
        }else{
            //should not get to this point i think
            console.log('noooooooooooooooooo');
            console.log(JSON.stringify(val1CExp));
            console.log('noooooooooooooooooo');
            return makeLitExp(val1CExp)
        }
    }else {
        return e
    }
};



// const isLast = (compSExp: CompoundSExp): boolean =>{
//     const a = isEmptySExp(compSExp.val2);
//     return a;
// };
//
// const rewriteLitExp = (e: LitExp): LitExp | AppExp => {
//     if (isEmptySExp(e.val)){
//         return e
//     }else if (isCompoundSExp(e.val)){
//         const val1 = e.val.val1;
//         const val1CExp = (typeof val1 === "number")?    makeNumExp(val1) : val1;
//
//         // const val1CExp = parseL3CExp(e.val.val1); // this produces error because 1 is not a valid sexp
//         const val2isCompoundSExp = isCompoundSExp(e.val.val2);
//         const val1isCExp = isCExp(val1CExp);
//         if (isCExp(val1CExp) && isEmptySExp(e.val.val2)){ // last in the list
//             return makeAppExp(makePrimOp('cons'),
//                 [rewriteCExp(val1CExp),
//                         rewriteLitExp(makeLitExp(makeEmptySExp()))
//                 ])
//         } else if (isCExp(val1CExp) && isCompoundSExp(e.val.val2)){
//             const what_came_back = rewriteLitExp(makeLitExp(e.val.val2));
//             const to_ret = makeAppExp(
//                     makePrimOp('cons'),
//                     [val1CExp, rewriteLitExp(makeLitExp(e.val.val2))]
//             );
//             return makeAppExp(
//                 makePrimOp('cons'),
//                 [val1CExp, rewriteLitExp(makeLitExp(e.val.val2))]
//             )
//         } else return e
//     }
// };


