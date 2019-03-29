import * as assert from "assert";
import { parseL3 } from './imp/L3-ast';
import { l2ToPython } from './q4';


assert.deepEqual(l2ToPython(parseL3(`(L3 (define b (> 3 4)) (define x 5) (define f (lambda (y) (+ x y))) (define g (lambda (y) (* x y))) (if (not b) (f 3) (g 4)) ((lambda (x) (* x x)) 7))`)),
`b = (3 > 4)
x = 5
f = (lambda y: (x + y))
g = (lambda y: (x * y))
(f(3) if (not b) else g(4))
(lambda x: (x * x))(7)`);

