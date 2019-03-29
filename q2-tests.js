"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var L3_eval_1 = require("./imp/L3-eval");
var L3_value_1 = require("./imp/L3-value");
var fs = require('fs');
var q2 = fs.readFileSync('./q2.l3', 'utf-8');

console.log(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '() '()))"));
console.log(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '(1 2) '(2 1)))"));


assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (empty? '()))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (empty? '(1)))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (empty? 1))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (empty? (cons 1 2)))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (list? '()))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (list? (list 2 3)))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (list? (cons 2 3)))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (list? (cons (cons 2 3) (cons 1 2))))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '() '()))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '(1 2) '(1 2)))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '(1 2) '(2 1)))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '(1 2) '(1 2 3)))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-slist? '(#t \"a\" (2 'b)) '(#t \"a\" (2 'b))))"), true);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? '(1 '(2 3)) '(1 '(2 4))))"), false);
assert.deepEqual(L3_eval_1.evalParse("(L3 " + q2 + " (equal-list? 2 2))"), false);
assert.deepEqual(L3_value_1.parsedToString(L3_eval_1.evalParse("(L3 " + q2 + "  (append '(1 2 3) '(4 5 6)))")), '(1 2 3 4 5 6)');
assert.deepEqual(L3_value_1.parsedToString(L3_eval_1.evalParse("(L3 " + q2 + "  (append3 '(1 2 3) '(4 5 6) 7))")), '(1 2 3 4 5 6 7)');
assert.deepEqual(L3_value_1.parsedToString(L3_eval_1.evalParse("(L3 " + q2 + "  (pascal 5))")), '(1 4 6 4 1)');
