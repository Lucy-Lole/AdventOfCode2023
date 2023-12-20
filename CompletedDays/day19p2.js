"use strict";
let fs = require('fs');
let input = fs.readFileSync("./Inputs/input19.txt").toString();
let rawWorkflows = input.split("\n\n")[0].split('\n').map(wf => ({name:wf.split('{')[0], rules:wf.split('{')[1].replace('}','').split(','), finale:wf.split('{')[1].replace('}','').split(',').slice(-1)[0]}));
let workflows = Object.assign({}, rawWorkflows.reduce((acc, wf) => {
    wf.rules.pop();
    wf.rules = wf.rules.map(r => ({finale:false, cat:r[0], greaterThan:r[1] == '>' ? true : false, value:parseInt(r.match(/[0-9]+/g)[0]), dest:r.split(':')[1], accept:0}))
    wf.rules.push({finale:true, dest:wf.finale});
    return {...acc, [wf.name]:wf};
}, {}));

workflows['A'] = {name:'A', rules:[{accept:1}]}
workflows['R'] = {name:'R', rules:[{accept:2}]}

function processRules(currentPart, ruleStack) {
    let rule = ruleStack.shift();

    if (rule.finale) {
        return  [...processRules(currentPart, [...workflows[rule.dest].rules])];
    }
    else if (rule.accept == 1) {
        return [currentPart];
    }
    else if (rule.accept == 2) {
        return [];
    }
    else {
        if (rule.greaterThan && (currentPart[rule.cat][0] > rule.value)) {
            // If all range greater than a greater rule, pass unaffected
            return [...processRules(currentPart, [...workflows[rule.dest].rules])];
        }
        else if (!rule.greaterThan && (currentPart[rule.cat][1] < rule.value)) {
            // If all range less than a lesser rule, pass unaffected
            return [...processRules(currentPart, [...workflows[rule.dest].rules])];
        }

        // Else we need to split up our range
        let newPart1 = {x:[...currentPart.x],m:[...currentPart.m],a:[...currentPart.a],s:[...currentPart.s]};
        let newPart2 = {x:[...currentPart.x],m:[...currentPart.m],a:[...currentPart.a],s:[...currentPart.s]};
        newPart1[rule.cat][0] = rule.value + (rule.greaterThan ? 1 : 0);
        newPart2[rule.cat][1] = rule.value - (rule.greaterThan ? 0 : 1);

        return [...processRules(rule.greaterThan ? newPart1 : newPart2, [...workflows[rule.dest].rules]), ...processRules(rule.greaterThan ? newPart2 : newPart1, ruleStack)];
    }
}

let accepted = processRules({x:[1, 4000], m:[1, 4000], a:[1, 4000], s:[1, 4000]}, [...workflows["in"].rules]);

console.log(accepted.reduce((acc, r) => (acc += ((r.x[1]-(r.x[0]-1)) * (r.m[1]-(r.m[0]-1)) * (r.a[1]-(r.a[0]-1)) * (r.s[1]-(r.s[0]-1)))), 0));