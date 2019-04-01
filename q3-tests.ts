import * as assert from "assert";
import { parseL3 } from './imp/L3-ast';
import { unparseL3 } from './imp/L3-unparse';
import { l3ToL30 } from './q3';

const util = require('util');

// console.log(util.inspect(parseL3(`'()`), {showHidden: false, depth: null}));
// console.log(util.inspect(parseL3(`'(1)`), {showHidden: false, depth: null}));
// console.log(util.inspect(parseL3(`'(1 2)`), {showHidden: false, depth: null}));
//
//
// console.log(util.inspect(parseL3(`(list)`), {showHidden: false, depth: null}));
// console.log(util.inspect(unparseL3(parseL3(`(list)`)), {showHidden: false, depth: null}));
//
// console.log(util.inspect(parseL3(`(list 1)`), {showHidden: false, depth: null}));
// console.log(util.inspect(parseL3(`(list 1 2)`), {showHidden: false, depth: null}));
// console.log(util.inspect(parseL3(`(cons 1 (cons 2 '()))`),{showHidden: false, depth: null}));


assert.deepEqual(unparseL3(l3ToL30(parseL3(`'()`))),`'()`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(list 1)`))),`(cons 1 '())`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(list 1 2)`))),`(cons 1 (cons 2 '()))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(list (list 1 2) (list 3 4))`))),`(cons (cons 1 (cons 2 '())) (cons (cons 3 (cons 4 '())) '()))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(list (cons 1 2) (cons 3 4))`))),`(cons (cons 1 2) (cons (cons 3 4) '()))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`'(1 2 3)`))),`(cons 1 (cons 2 (cons 3 '())))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(list (cons (* 5  6) '(1 2 3)))`))),`(cons (cons (* 5 6) (cons 1 (cons 2 (cons 3 '())))) '())`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(lambda (x) (list x 3))`))),`(lambda (x) (cons x (cons 3 '())))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(if (> x y) (list 1 2) '(3 4))`))),`(if (> x y) (cons 1 (cons 2 '())) (cons 3 (cons 4 '())))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(+ 3 4)`))),`(+ 3 4)`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`x`))),`x`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`((lambda (x) (* x x)) 3)`))),`((lambda (x) (* x x)) 3)`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`((lambda (x) (list x x)) 3)`))),`((lambda (x) (cons x (cons x '()))) 3)`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`((lambda (x) (list x x)) '(5 6))`))),`((lambda (x) (cons x (cons x '()))) (cons 5 (cons 6 '())))`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(let ((x 5)) x)`))),`(let ((x 5)) x)`);
assert.deepEqual(unparseL3(l3ToL30(parseL3(`(let ((x '(1 2)) (y (list 3 4))) (list x y))`))),`(let ((x (cons 1 (cons 2 '()))) (y (cons 3 (cons 4 '())))) (cons x (cons y '())))`);

