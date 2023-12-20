"use strict";
let fs = require('fs');
let input = fs.readFileSync("./Inputs/input19.txt").toString();
let rawWorkflows = input.split("\n\n")[0].split('\n').map(wf => ({name:wf.split('{')[0], rules:wf.split('{')[1].replace('}','').split(','), finale:wf.split('{')[1].replace('}','').split(',').slice(-1)[0]}));
let workflows = Object.assign({}, rawWorkflows.reduce((acc, wf) => {
    wf.rules.pop();
    wf.rules = wf.rules.map(r => ({finale:false, cat:r[0], greaterThan:r[1] == '>' ? true : false, value:r.match(/[0-9]+/g)[0], dest:r.split(':')[1], accept:0}))
    wf.rules.push({finale:true, dest:wf.finale});
    return {...acc, [wf.name]:wf};
}, {}));
let parts = input.split("\n\n")[1].replace(/\{\}/g, '').split('\n').map(p => 
    ({x:parseInt(p.split(',')[0].match(/[0-9]+/)[0]),
      m:parseInt(p.split(',')[1].match(/[0-9]+/)[0]),
      a:parseInt(p.split(',')[2].match(/[0-9]+/)[0]),
      s:parseInt(p.split(',')[3].match(/[0-9]+/)[0])}));

workflows['A'] = {name:'A', rules:[{accept:1}]}
workflows['R'] = {name:'R', rules:[{accept:2}]}

function processPart(part) {
    let ruleStack = [...workflows["in"].rules];

    while (ruleStack.length > 0) {
        let rule = ruleStack.shift();
        if (rule.finale) {
            ruleStack = [...workflows[rule.dest].rules];
            continue;
        }
        else if (rule.accept == 1) {
            return true;
        }
        else if (rule.accept == 2) {
            return false;
        }
        else if ((part[rule.cat] > rule.value) == rule.greaterThan) {
            ruleStack = [...workflows[rule.dest].rules];
            continue;
        }
    }
}

let accepted = [];

for (let i = 0; i < parts.length; i++) {
    if (processPart(parts[i])) accepted.push(parts[i]);
}

console.log(accepted.reduce((acc, p) => acc += (p.x+p.m+p.a+p.s),0));