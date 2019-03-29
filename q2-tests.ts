import * as assert from "assert";
import { evalParse} from './imp/L3-eval';
import { parsedToString } from './imp/L3-value'

declare var require: any
const fs = require('fs');


const q2 : string = fs.readFileSync('./q2.l3','utf-8');


assert.deepEqual(evalParse(`(L3 ` + q2 + ` (empty? '()))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (empty? '(1)))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (empty? 1))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (empty? (cons 1 2)))`),false);

assert.deepEqual(evalParse(`(L3 ` + q2 + ` (list? '()))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (list? (list 2 3)))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (list? (cons 2 3)))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (list? (cons (cons 2 3) (cons 1 2))))`),false);

assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '() '()))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '(1 2) '(1 2)))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '(1 2) '(2 1)))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '(1 2) '(1 2 3)))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '(#t "a" (2 'b)) '(#t "a" (2 'b))))`),true);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? '(1 '(2 3)) '(1 '(2 4))))`),false);
assert.deepEqual(evalParse(`(L3 ` + q2 + ` (equal-list? 2 2))`),false);

assert.deepEqual(parsedToString(evalParse(`(L3 ` + q2 + `  (append '(1 2 3) '(4 5 6)))`)),'(1 2 3 4 5 6)');
assert.deepEqual(parsedToString(evalParse(`(L3 ` + q2 + `  (append3 '(1 2 3) '(4 5 6) 7))`)),'(1 2 3 4 5 6 7)');
assert.deepEqual(parsedToString(evalParse(`(L3 ` + q2 + `  (pascal 5))`)),'(1 4 6 4 1)');

