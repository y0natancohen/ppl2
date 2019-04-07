import * as assert from "assert";
import { parseL3 } from './imp/L3-ast';
import { l2ToPython } from './q4';

import { map } from "ramda";
assert.deepEqual(l2ToPython(parseL3(`(L3 (define b (> 3 4)) 
(define x 5) 
(define f (lambda (y z) (+ x y z))) 
(define g (lambda (y) (* x y))) 
(if (not b) (f 3 7) (g 4)) 
((lambda (x) (* x x)) 7)
(if (= x 3) 4 5)
(lambda (x y) (* x y))
((lambda (x y) (* x y)) 3 4)
(define pi 3.14)
(define f (lambda (x y) (* x y)))
(and 2 3 4)
(or 1 1 1)
(f 3 4))`)),


`b = (3 > 4)
x = 5
f = (lambda y, z: (x + y + z))
g = (lambda y: (x * y))
(f(3,7) if (not b) else g(4))
(lambda x: (x * x))(7)
(4 if (x == 3) else 5)
(lambda x, y: (x * y))
(lambda x, y: (x * y))(3,4)
pi = 3.14
f = (lambda x, y: (x * y))
(2 and 3 and 4)
(1 or 1 or 1)
f(3,4)`);


// const expected = `b = (3 > 4)
// x = 5
// f = (lambda y, z: (x + y + z))
// g = (lambda y: (x * y))
// (f(3,7) if (not b) else g(4))
// (lambda x: (x * x))(7)
// (4 if (x == 3) else 5)
// (lambda x, y: (x * y))
// (lambda x, y: (x * y))(3,4)
// pi = 3.14
// f = (lambda x, y: (x * y))
// (2 and 3 and 4)
// (1 or 1 or 1)
// f(3,4)`;
// const actual = l2ToPython(parseL3(`(L3 (define b (> 3 4)) 
// (define x 5) 
// (define f (lambda (y z) (+ x y z))) 
// (define g (lambda (y) (* x y))) 
// (if (not b) (f 3 7) (g 4)) 
// ((lambda (x) (* x x)) 7)
// (if (= x 3) 4 5)
// (lambda (x y) (* x y))
// ((lambda (x y) (* x y)) 3 4)
// (define pi 3.14)
// (define f (lambda (x y) (* x y)))
// (and 2 3 4)
// (or 1 1 1)
// (f 3 4))`));
// console.log("Excpeted: ")
// console.log(expected);
// console.log("-----------------------------------------------")
// console.log("Actual: ")
// console.log(actual)
