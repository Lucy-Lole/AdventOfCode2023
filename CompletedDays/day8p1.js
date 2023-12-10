let fs = require('fs');
let lines = fs.readFileSync("./Inputs/input8.txt").toString().split('\n');
let directions = lines[0];
let nodes = lines.slice(1).reduce((x, y) => ({ ...x, [y.slice(0,3)]:{LeftNode:y.slice(7,10), RightNode:y.slice(12,15)}}));

let currentNode = nodes.AAA;

for (totalSteps = 0;; totalSteps++) {
    if (currentNode === nodes.ZZZ) break;
    else currentNode = directions[totalSteps%directions.length] == 'L' ? nodes[currentNode.LeftNode] : nodes[currentNode.RightNode];
}

console.log(totalSteps);