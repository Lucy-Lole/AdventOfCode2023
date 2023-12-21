"use strict";
let fs = require('fs');
let grid = fs.readFileSync("./Inputs/input21.txt").toString().split('\n').map(x =>x.split(''));
var STEPS_REMAINING = 64;
let startPoint;

function makeKey(y,x) {return y.toString() + ',' + x.toString();}

let nodes = {};

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == '#') continue;

        nodes[makeKey(y,x)] = {ID:makeKey(y,x), x:x, y:y, neighbors:[], distance:9999999999, cameFrom:null, endingSpot:false};
        if (grid[y][x] == 'S') {
            startPoint = makeKey(y,x);
            nodes[makeKey(y,x)].distance = 0;
        }
    }
}

Object.values(nodes).forEach(node => {
    if (nodes[makeKey(node.y,node.x-1)] != undefined) node.neighbors.push(nodes[makeKey(node.y,node.x-1)]);
    if (nodes[makeKey(node.y,node.x+1)] != undefined) node.neighbors.push(nodes[makeKey(node.y,node.x+1)]);
    if (nodes[makeKey(node.y-1,node.x)] != undefined) node.neighbors.push(nodes[makeKey(node.y-1,node.x)]);
    if (nodes[makeKey(node.y+1,node.x)] != undefined) node.neighbors.push(nodes[makeKey(node.y+1,node.x)]);
});

let openSet = [nodes[startPoint]];

while (openSet.length > 0) {
    let node = openSet.shift();

    for(let i=0;i<node.neighbors.length;i++) {
        if (node.distance + 1 < node.neighbors[i].distance) {
            node.neighbors[i].cameFrom = node;
            node.neighbors[i].distance = node.distance + 1;
            if (node.neighbors[i].distance == STEPS_REMAINING) node.neighbors[i].endingSpot = true;
            openSet.push(...node.neighbors);
        }
    }
}

function printGrid() {
    for (let y = 0; y < grid.length; y++) {
        let line = "";
        for (let x = 0; x < grid[y].length; x++) {
            if (nodes[makeKey(y,x)] == undefined) line += '#';
            else if (nodes[makeKey(y,x)].endingSpot) line += 'O';
            else line += '.';
        }
        console.log(line);
    }
}

for (let y = 0; y < grid.length; y++) {
    let offSet = y % 2 == 0 ? 0 : 1;
    for (let x = offSet; x < grid[y].length; x+=2) {
        if (nodes.hasOwnProperty(makeKey(y,x)) && nodes[makeKey(y,x)].distance <= STEPS_REMAINING) nodes[makeKey(y,x)].endingSpot = true;
    }
}

printGrid();

console.log(Object.values(nodes).reduce((acc, n) => acc += n.endingSpot ? 1 : 0, 0));