"use strict";
let fs = require('fs');
let grid = fs.readFileSync("./Inputs/input17.txt").toString().split('\n').map(x => x.split(''));
let horLength = grid[0].length;
let verLength = grid.length;
let directions = {left:0,up:1,right:2,down:3};
let finalSet = [];
let cameFrom = {};
let nodes = {};
for (let y=0;y<grid.length;y++) {
    for(let x=0;x<grid[y].length; x++) {
        nodes[y + '|' + x + '|' + '0' + '|' + '1'] = {y:y, x:x, entry:directions.left, step:1, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '0' + '|' + '2'] = {y:y, x:x, entry:directions.left, step:2, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '0' + '|' + '3'] = {y:y, x:x, entry:directions.left, step:3, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};

        nodes[y + '|' + x + '|' + '1' + '|' + '1'] = {y:y, x:x, entry:directions.up, step:1, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '1' + '|' + '2'] = {y:y, x:x, entry:directions.up, step:2, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '1' + '|' + '3'] = {y:y, x:x, entry:directions.up, step:3, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};

        nodes[y + '|' + x + '|' + '2' + '|' + '1'] = {y:y, x:x, entry:directions.right, step:1, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '2' + '|' + '2'] = {y:y, x:x, entry:directions.right, step:2, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '2' + '|' + '3'] = {y:y, x:x, entry:directions.right, step:3, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};

        nodes[y + '|' + x + '|' + '3' + '|' + '1'] = {y:y, x:x, entry:directions.down, step:1, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '3' + '|' + '2'] = {y:y, x:x, entry:directions.down, step:2, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
        nodes[y + '|' + x + '|' + '3' + '|' + '3'] = {y:y, x:x, entry:directions.down, step:3, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
    }
}

// Construct our graph
Object.values(nodes).forEach(node => {
    node.neighbors = [];
    let step = node.step;

    if (node.entry == directions.left) {
        if (node.step < 3) {
            if (node.x > 0) node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + '|' + (step+1)]);
        }
        if (node.y > 0)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + "|1"]);
        if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + "|1"]);
    }
    else if (node.entry == directions.up) {
        if (node.step < 3) {
            if (node.y > 0) node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + '|' + (step+1)]);
        }
        if (node.x > 0)           node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + "|1"]);
        if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + "|1"]);
    }
    else if (node.entry == directions.right) {
        if (node.step < 3) {
            if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + '|' + (step+1)]);
        }
        if (node.y > 0)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + "|1"]);
        if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + "|1"]);
    }
    else if (node.entry == directions.down) {
        if (node.step < 3) {
            if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + '|' + (step+1)]);
        }
        if (node.x > 0)           node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + "|1"]);
        if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + "|1"]);
    }
})

// Set up for A*
function h(node) {
    return (verLength - node.y) + (horLength - node.x);
}

function getKey(node) {
    return node.y.toString() + '|' + node.x.toString() + '|' + node.entry.toString() + '|' + node.step.toString();
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

let start = nodes["0|0|2|1"];

start.gScore = 0;
start.fscore = h(start);

let openSet = [start];

let total = 0;

// Do A*
while (openSet.length > 0) {
    let current = openSet.shift();

    if (current.x == horLength-1 && current.y == verLength-1) {
        total = reconstructPath(current);
        break;
    }

    current.neighbors.forEach(neighbor => {
        let tentGScore = (current.gScore + neighbor.weight);
        if (tentGScore < neighbor.gScore) {
            cameFrom[getKey(neighbor)] = {node:current};
            neighbor.gScore = tentGScore;
            neighbor.fScore = tentGScore + h(neighbor);
            if (openSet.find(x => x == neighbor) == undefined) openSet.push(neighbor);
        }

    });

    openSet = openSet.sort((a,b) => a.fScore - b.fScore);
}

console.log(total);