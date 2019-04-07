"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./imp/L3-ast");
var L3_ast_2 = require("./imp/L3-ast");
var L3_ast_3 = require("./imp/L3-ast");
var L3_value_1 = require("./imp/L3-value");
/*
Purpose: transforms a L3 AST (abstrcat syntax tree) to a L30 AST.
L30 is defined as L3 excluding the ​list ​ primitive operation and the literal expression for lists.

Signature: l3ToL30(exp)

Type: [Parsed -> Parsed]
*/
exports.l3ToL30 = function (exp) {
    return L3_ast_3.isExp(exp) ? rewriteExp(exp) :
        L3_ast_3.isProgram(exp) ? L3_ast_2.makeProgram(ramda_1.map(rewriteExp, exp.exps)) :
            exp;
};
var rewriteExp = function (exp) {
    return L3_ast_3.isCExp(exp) ? rewriteCExp(exp) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_2.makeDefineExp(exp.var, rewriteCExp(exp.val)) :
            exp;
};
var rewriteBinding = function (b) {
    return L3_ast_2.makeBinding(b.var.var, rewriteCExp(b.val));
};
var rewriteCExp = function (exp) {
    return L3_ast_3.isLitExp(exp) ? rewriteLitExp(exp) :
        L3_ast_3.isIfExp(exp) ? L3_ast_2.makeIfExp(rewriteCExp(exp.test), rewriteCExp(exp.then), rewriteCExp(exp.alt)) :
            L3_ast_3.isAppExp(exp) ? rewriteAppExp(exp) :
                L3_ast_3.isProcExp(exp) ? L3_ast_2.makeProcExp(exp.args, ramda_1.map(rewriteCExp, exp.body)) :
                    L3_ast_3.isLetExp(exp) ? L3_ast_2.makeLetExp(ramda_1.map(rewriteBinding, exp.bindings), ramda_1.map(rewriteCExp, exp.body)) :
                        exp;
};
var rewriteAppExp = function (e) {
    if (L3_ast_3.isPrimOp(e.rator) && e.rator.op === 'list') {
        if (e.rands.length === 0) {
            return L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp());
        }
        else {
            return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(e.rands[0]),
                // map(rewriteAppExp, e.rands.slice(1)))]
                rewriteAppExp(L3_ast_2.makeAppExp(e.rator, e.rands.slice(1)))]);
        }
    }
    else if (L3_ast_3.isProcExp(e.rator)) {
        return L3_ast_2.makeAppExp(L3_ast_2.makeProcExp(e.rator.args, ramda_1.map(rewriteCExp, e.rator.body)), ramda_1.map(rewriteCExp, e.rands));
    }
    else {
        return L3_ast_2.makeAppExp(e.rator, ramda_1.map(rewriteCExp, e.rands));
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
var isPrimitiveOp = function (x) {
    return x === "+" ||
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
};
var rewriteLitExp = function (e) {
    if (L3_value_1.isEmptySExp(e.val)) {
        return L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp());
    }
    else if (L3_value_1.isCompoundSExp(e.val)) { // list
        var val1 = e.val.val1;
        var val2 = e.val.val2;
        // number | boolean | string | PrimOp | Closure | SymbolSExp | EmptySExp | CompoundSExp
        var val1CExp = void 0;
        if (L3_ast_1.isNumber(val1)) {
            val1CExp = L3_ast_1.makeNumExp(val1);
        }
        else if (L3_ast_1.isBoolean(val1)) {
            val1CExp = L3_ast_1.makeBoolExp(val1);
        }
        else if (L3_ast_1.isString(val1)) {
            val1CExp = L3_ast_1.makeStrExp(val1);
        }
        else if (L3_value_1.isSymbolSExp(val1)) {
            val1CExp = L3_ast_2.makeLitExp(val1);
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
        }
        else if (L3_value_1.isCompoundSExp(val1)) {
            val1CExp = rewriteLitExp(L3_ast_2.makeLitExp(val1));
        }
        else {
            // val1CExp = makeNumExp(1); // delete this
            val1CExp = L3_ast_2.makeLitExp(val1);
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
        if (L3_ast_3.isCExp(val1CExp)) {
            if (L3_value_1.isEmptySExp(val2)) { // last in list
                return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(val1CExp), L3_ast_2.makeLitExp(L3_value_1.makeEmptySExp())]);
            }
            else { // middle of list
                return L3_ast_2.makeAppExp(L3_ast_2.makePrimOp('cons'), [rewriteCExp(val1CExp), rewriteLitExp(L3_ast_2.makeLitExp(val2))]);
            }
        }
        else {
            //should not get to this point i think
            console.log('noooooooooooooooooo');
            console.log(JSON.stringify(val1CExp));
            console.log('noooooooooooooooooo');
            return L3_ast_2.makeLitExp(val1CExp);
        }
    }
    else {
        return e;
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
