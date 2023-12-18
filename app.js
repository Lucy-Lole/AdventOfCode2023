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
        nodes[y + '|' + x + '|' + '0'] = {y:y, x:x, entry:directions.left, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '1'] = {y:y, x:x, entry:directions.up, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '2'] = {y:y, x:x, entry:directions.right, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '3'] = {y:y, x:x, entry:directions.down, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
    }
}

// Construct our graph
Object.values(nodes).forEach(node => {
    node.neighbors = [];
    if (node.x > 0 && node.entry != directions.right) node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left]);
    if (node.x < horLength-1 && node.entry != directions.left) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right]);
    if (node.y > 0&& node.entry != directions.down)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up]);
    if (node.y < verLength-1&& node.entry != directions.up) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down]);
})

// Set up for A*
function h(node) {
    return (verLength - node.y) + (horLength - node.x);
}

function getKey(node) {
    return node.y.toString() + '|' + node.x.toString() + '|' + node.entry.toString();
}

function printArray() {
    for (let y=0;y<grid.length;y++) {
        let line = "";
        for(let x=0;x<grid[y].length; x++) {
            if (cameFrom[y + '|' + x] != undefined && finalSet.includes(nodes[y + '|' + x])) {
                if (cameFrom[y + '|' + x].dir == directions.down) line += 'V';
                else if (cameFrom[y + '|' + x].dir == directions.up) line += '^';
                else if (cameFrom[y + '|' + x].dir == directions.right) line += '>';
                else if (cameFrom[y + '|' + x].dir == directions.left) line += '<';
            }
            else line+='.';
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

let start = nodes["0|0|2"];
let end = nodes[(verLength-1) + '|' + (horLength-1) + '|2'];

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
            let tmpStep = 0;

            if (cameFrom[getKey(current)] != undefined && cameFrom[getKey(current)].node.dir == current.dir) tmpStep = cameFrom[getKey(current)].step;

            if (current.entry == neighbor.entry) tmpStep++;

            if (tmpStep > 3) return;

            cameFrom[getKey(neighbor)] = {node:current,step:tmpStep};
            neighbor.gScore = tentGScore;
            neighbor.fScore = tentGScore + h(neighbor);
            if (openSet.find(x => x == neighbor) == undefined) openSet.push(neighbor);
        }

    });

    openSet = openSet.sort((a,b) => a.fScore - b.fScore);
}

console.log(total);