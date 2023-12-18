"use strict";
let fs = require('fs');
let grid = fs.readFileSync("./Inputs/day17example.txt").toString().split('\n').map(x => x.split(''));
let horLength = grid[0].length;
let verLength = grid.length;
let directions = {left:0,up:1,right:2,down:3};
let finalSet = [];
let cameFrom = {};
let nodes = {};
for (let y=0;y<grid.length;y++) {
    for(let x=0;x<grid[y].length; x++) {
        nodes[y + '|' + x] = {y:y, x:x, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
    }
}

// Construct our graph
Object.values(nodes).forEach(node => {
    node.neighbors = [];
    if (node.x > 0)           node.neighbors.push(nodes[node.y + '|' + (node.x-1)]);
    if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1)]);
    if (node.y > 0)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x]);
    if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x]);
})

// Set up for A*
function h(node) {
    return (verLength - node.y) + (horLength - node.x);
}

function getKey(node) {
    return node.y.toString() + '|' + node.x.toString();
}

function printArray() {
    for (let y=0;y<grid.length;y++) {
        let line = "";
        for(let x=0;x<grid[y].length; x++) {
            if (cameFrom[y + '|' + x] != undefined && finalSet.includes(cameFrom[y + '|' + x].node)) {
                if (cameFrom[y + '|' + x].dir == directions.down) line += 'V';
                else if (cameFrom[y + '|' + x].dir == directions.up) line += '^';
                else if (cameFrom[y + '|' + x].dir == directions.right) line += '>';
                else if (cameFrom[y + '|' + x].dir == directions.left) line += '<';
            }
            else line+='_';
        }

        console.log(line);
    }
}

function reconstructPath(current) {
    let totalWeight = 0;


    while (current != start) {
        finalSet.push(current);
        totalWeight += current.weight;
        current = cameFrom[getKey(current)].node;
    }

    finalSet.push(current);
    finalSet.reverse();
    return totalWeight;
}

let start = nodes["0|0"];
let end = nodes[(verLength-1) + '|' + (horLength-1)];

start.gScore = 0;
start.fscore = h(start);

let openSet = [start];

let total = 0;

// Do A*
while (openSet.length > 0) {
    let current = openSet.shift();

    if (current == end) {
        total = reconstructPath(current);
        break;
    }

    current.neighbors.forEach(neighbor => {
        let tentGScore = (current.gScore + neighbor.weight);
        if (tentGScore < neighbor.gScore) {
            let tmpDir;
            let tmpStep = 1;

            if (neighbor.x > current.x) tmpDir = directions.right;
            else if (neighbor.x < current.x) tmpDir = directions.left;
            else if (neighbor.y > current.y) tmpDir = directions.down;
            else if (neighbor.y < current.y) tmpDir = directions.up;

            if (cameFrom[getKey(current)] != undefined && cameFrom[getKey(current)].dir == tmpDir) tmpStep = (cameFrom[getKey(current)].step + 1);

            if (tmpStep > 3) return;

            cameFrom[getKey(neighbor)] = {node:current,dir:tmpDir,step:tmpStep};
            neighbor.gScore = tentGScore;
            neighbor.fScore = tentGScore + h(neighbor);
            if (openSet.find(x => x == neighbor) == undefined) openSet.push(neighbor);
        }

    });

    openSet = openSet.sort((a,b) => a.fScore - b.fScore);
}

printArray();

console.log(total);