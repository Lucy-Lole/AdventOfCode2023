let fs = require('fs');
let lines = fs.readFileSync("./Inputs/input8.txt").toString().split('\n');
let directions = lines[0];
let nodes = lines.slice(1).reduce((x, y) => ({ ...x, [y.slice(0,3)]:{ID:y.slice(0,3), LeftNode:y.slice(7,10), RightNode:y.slice(12,15), start:(y.slice(2,3)=='A'), end:(y.slice(2,3)=='Z')}}));

let startingNodes = Object.keys(nodes).filter(x => x[2] == 'A');
let currentNodes = Object.values(nodes).filter(x => x.start);
let loopTimes = [];
let totalSteps = 0;

for (totalSteps = 0;; totalSteps++) {
    if (loopTimes.length == startingNodes.length && loopTimes.every(x => x.stepLength != -1)) {
        break;
    }

    for (i=0;i<currentNodes.length;i++) {
        let node = currentNodes[i];
        currentNodes[i] = directions[totalSteps%directions.length] == 'L' ? nodes[node.LeftNode] : nodes[node.RightNode];

        if (currentNodes[i].end) {
            if (loopTimes[i] == null) loopTimes[i] = {firstHit:totalSteps, stepLength:-1};
            else if (loopTimes[i].stepLength == -1) loopTimes[i] = loopTimes[i].stepLength = (totalSteps - loopTimes[i].firstHit);
        }
    }
}

// LCM code credit: https://stackoverflow.com/a/49722579
const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

console.log(loopTimes.reduce(lcm));