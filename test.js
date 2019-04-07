// var a  = { tag: 'LitExp',
//     val:
//         { tag: 'CompoundSexp',
//             val1:
//                 { tag: 'CompoundSexp',
//                     val1: { tag: 'SymbolSExp', val: 'list' },
//                     val2:
//                         { tag: 'CompoundSexp',
//                             val1: 1,
//                             val2: { tag: 'CompoundSexp', val1: 2, val2: { tag: 'EmptySExp' } } } },
//             val2: { tag: 'CompoundSexp', val1: 3, val2: { tag: 'EmptySExp' } } } };
//
// function f(litExp) {
//     if litExp.val === 'CompoundSexp'
//
// }

console.log([3,4].reduce((acc, curr)=> acc % curr, 5));

console.log([4,3].reduce((acc, curr)=> acc % curr, 5));