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
        Object.values(directions).forEach(dir => {
            for (let index = 1; index <= 10; index++) {
                nodes[y + '|' + x + '|' + dir + '|' + index] = {y:y, x:x, entry:dir, step:index, weight:parseInt(grid[y][x]), gScore:99999999999999, fScore:99999999999999};
            }
        })
    }
}

// Construct our graph
Object.values(nodes).forEach(node => {
    node.neighbors = [];
    let step = node.step;

    if (node.entry == directions.left) {
        if (node.step < 10) {
            if (node.x > 0) node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + '|' + (step+1)]);
        }
        if (step > 3) {
            if (node.y > 0)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + "|1"]);
            if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + "|1"]);
        }
    }
    else if (node.entry == directions.up) {
        if (node.step < 10) {
            if (node.y > 0) node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + '|' + (step+1)]);
        }
        if (step > 3){
            if (node.x > 0)           node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + "|1"]);
            if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + "|1"]);
        }
    }
    else if (node.entry == directions.right) {
        if (node.step < 10) {
            if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + '|' + (step+1)]);
        }
        if (step > 3) {
            if (node.y > 0)           node.neighbors.push(nodes[(node.y-1) + '|' + node.x + '|' + directions.up + "|1"]);
            if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + "|1"]);
        }
    }
    else if (node.entry == directions.down) {
        if (node.step < 10) {
            if (node.y < verLength-1) node.neighbors.push(nodes[(node.y+1) + '|' + node.x + '|' + directions.down + '|' + (step+1)]);
        }
        if (step > 3) {
            if (node.x > 0)           node.neighbors.push(nodes[node.y + '|' + (node.x-1) + '|' + directions.left + "|1"]);
            if (node.x < horLength-1) node.neighbors.push(nodes[node.y + '|' + (node.x+1) + '|' + directions.right + "|1"]);
        }
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


    while (!(current.x == 0 && current.y == 0))  {
        finalSet.push(current);
        totalWeight += current.weight;
        current = cameFrom[getKey(current)].node;
    }

    finalSet.push(current);
    finalSet.reverse();
    return totalWeight;
}

let start = [nodes["0|0|2|1"], nodes["0|0|3|1"]];

let total = 99999999999999;

start.forEach(node => {
    node.gScore = 0;
    node.fscore = h(node);

    let openSet = [node];

    while (openSet.length > 0) {
        let current = openSet.shift();
    
        if (current.x == horLength-1 && current.y == verLength-1 && current.step > 3) {
            let tmpTotal = reconstructPath(current);
            if (tmpTotal < total) total = tmpTotal;
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
})

console.log(total);