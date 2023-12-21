"use strict";
let fs = require('fs');
let grid = fs.readFileSync("./Inputs/day21example.txt").toString().split('\n').map(x =>x.split(''));
let width = grid[0].length-1;
let height = grid.length-1;
var STEPS_REMAINING = 6;
let startPoint;

function makeKey(y,x) {return y.toString() + ',' + x.toString();}

let nodes = {};

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == '#') continue;

        nodes[makeKey(y,x)] = {ID:makeKey(y,x), x:x, y:y, neighbors:[], distance:9999999999, cameFrom:null, endingSpot:false, universalLink};
        if (grid[y][x] == 'S') {
            startPoint = makeKey(y,x);
            nodes[makeKey(y,x)].distance = 0;
        }
    }
}

Object.values(nodes).forEach(node => {
    if (nodes[makeKey(node.y,node.x-1)] != undefined) node.neighbors.push({link:false, node:nodes[makeKey(node.y,node.x-1)]});
    if (nodes[makeKey(node.y,node.x+1)] != undefined) node.neighbors.push({link:false, node:nodes[makeKey(node.y,node.x+1)]});
    if (nodes[makeKey(node.y-1,node.x)] != undefined) node.neighbors.push({link:false, node:nodes[makeKey(node.y-1,node.x)]});
    if (nodes[makeKey(node.y+1,node.x)] != undefined) node.neighbors.push({link:false, node:nodes[makeKey(node.y+1,node.x)]});
    if (node.x == 0 && nodes[makeKey(node.y,width)] != undefined);
    if (node.x == width && nodes[makeKey(node.y,0)] != undefined);
    if (node.y == 0 && nodes[makeKey(height,node.x)] != undefined);
    if (node.y == height && nodes[makeKey(0,node.x)] != undefined);
});

let openSet = [{universe:0, node:nodes[startPoint]}];

while (openSet.length > 0) {
    let uNode = openSet.shift();

    for(let i=0; i < uNode.node.neighbors.length;i++) {
        if (uNode.node.distance + 1 < uNode.node.neighbors[i].node.distance) {
            uNode.node.neighbors[i].cameFrom = uNode.node;
            uNode.node.neighbors[i].distance = uNode.node.distance + 1;
            if (uNode.node.neighbors[i].distance == STEPS_REMAINING) uNode.node.neighbors[i].endingSpot = true;
            openSet.push(...uNode.node.neighbors.map(n => ({universe:uNode.universe, node:n})));
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