"use strict";
let fs = require('fs');
var processingStack = [];
var totalHighPulses = 0;
var totalLowPulses = 0;
var loopTimes = {};
var gotAllLoopTimes = false;
function addToStack(pulse) {
    if (pulse.module != undefined) processingStack.push(pulse); // We cant process an untyped module
    if (pulse.pulse) totalHighPulses++;
    else totalLowPulses++;
}

let flipFlop = ((module, pulse, sender) => 
{
    if (!pulse) {
        if (!module.state.hasOwnProperty('state') || !module.state.state) {
            module.state.state = true;
            broadcast(module, true, sender);
        }
        else {
            module.state.state = false;
            broadcast(module, false, sender);
        }
    }
});

let broadcast = ((module, pulse, sender) => 
{
    for (let i = 0; i < module.dests.length; i++) {
        addToStack({module:modules[module.dests[i]], pulse:pulse, sender:module.name});
    }
});

let conjunct = ((module, pulse, sender) => {
    module.state[sender] = pulse;

    if (module.dests.includes('rx')) {
        Object.entries(module.state).forEach(state => {
            if (state[1]) {
                if (loopTimes[state[0]] == undefined) loopTimes[state[0]] = push;
                if (Object.entries(loopTimes).length == Object.entries(module.state).length) gotAllLoopTimes = true;
            }
        })
    }

    if (Object.values(module.state).every(x=>x)) broadcast(module, false, sender);
    else broadcast(module, true, sender)
});

let modules = Object.assign({}, fs.readFileSync("./Inputs/input20.txt").toString().replace("broadcaster", "+broadcaster").split('\n').reduce((acc, m) => ({...acc, [m.split(' ')[0].slice(1)]:{name:m.split(' ')[0].slice(1), type:m.split(' ')[0][0], state:{}, dests:m.split("->")[1].replace(/ /g,'').split(",")}}), {}));
Object.values(modules).forEach(mod => {
    mod.handler = mod.type == '+' ? broadcast : mod.type == '%' ? flipFlop : conjunct;
    for (let i = 0; i < mod.dests.length; i++) {
        if (modules[mod.dests[i]] != undefined && modules[mod.dests[i]].type == '&') modules[mod.dests[i]].state[mod.name] = false;
    }
});

var push = 0;
while (!gotAllLoopTimes) {
    push++;
    addToStack({module:modules["broadcaster"], pulse:false, sender:"MAJ"});

    while (processingStack.length > 0) {
        let frame = processingStack.shift();
        frame.module.handler(frame.module,frame.pulse,frame.sender);
    }
}

// LCM code credit: https://stackoverflow.com/a/49722579
const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

console.log(Object.values(loopTimes).reduce(lcm));