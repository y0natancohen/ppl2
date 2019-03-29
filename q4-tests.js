"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var L3_ast_1 = require("./imp/L3-ast");
var q4_1 = require("./q4");
assert.deepEqual(q4_1.l2ToPython(L3_ast_1.parseL3("(L3 (define b (> 3 4)) (define x 5) (define f (lambda (y) (+ x y))) (define g (lambda (y) (* x y))) (if (not b) (f 3) (g 4)) ((lambda (x) (* x x)) 7))")), "b = (3 > 4)\nx = 5\nf = (lambda y: (x + y))\ng = (lambda y: (x * y))\n(f(3) if (not b) else g(4))\n(lambda x: (x * x))(7)");
