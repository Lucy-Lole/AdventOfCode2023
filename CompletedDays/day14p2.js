let fs = require('fs');
let grid = fs.readFileSync("./Inputs/input14.txt").toString().split('\n').map(x => [...x]);
let startOfCycles = {};

function rotateGrid(inputGrid) {
    let newArr = [];

    for (let i=0;i<inputGrid[0].length;i++) {
        let column = [];
        for (let j=0;j<inputGrid.length;j++) {
            column.push(inputGrid[j][i]);
        }
        newArr.push(column.reverse());
    }

    return newArr;
}

function tilt(inputGrid) {
    let returnGrid = [];
    for (let a=0;a<inputGrid.length;a++) {
        returnGrid.push(inputGrid[a].slice());
    }

    for(let y=1;y<returnGrid.length;y++) {
        for (let x=0;x<returnGrid[y].length;x++) {
            if (returnGrid[y][x] == 'O') {
                let tmpY = y-1;
                while (tmpY > -1) {
                    if (returnGrid[tmpY][x] == '.') {
                        returnGrid[tmpY][x] = 'O';
                        returnGrid[tmpY+1][x] = '.';
                        tmpY--;
                    }
                    else{
                        break;
                    }
                }
            }
        }
    }

    return returnGrid;
}

let cycles = 1000000000;
let loopFind = true;
for (let cycle = 0; cycle < cycles; cycle++) {
    let str = grid.toString();

    if (loopFind) {
        if (startOfCycles[str] == null) startOfCycles[str] = {hits:1, initial:cycle};
        else {
            startOfCycles[str].hits++;
            if (startOfCycles[str].hits == 3) {
                let loopSize = 0;
                for (let x = 0; x < Object.values(startOfCycles).length; x++) {
                    let entry = Object.values(startOfCycles)[x];
                    if (entry.hits > 1) loopSize++;
                }
    
                let remainingLoops = (cycles - cycle) % loopSize;
                loopFind = false
                cycle = cycles - remainingLoops;
            }
        }
    }

    grid = tilt(grid); // North
    grid = rotateGrid(grid);
    grid = tilt(grid); // West
    grid = rotateGrid(grid);
    grid = tilt(grid); // South
    grid = rotateGrid(grid);
    grid = tilt(grid); // East
    grid = rotateGrid(grid);
    console.log ("Cycle " + (cycle+1) + "/" + cycles);
}

let total = 0;

for (let i=0;i<grid.length;i++) {
    let rowValue = (grid.length - i);
    let rockCount = 0;
    for (let j=0;j<grid[i].length;j++){
        if (grid[i][j] == 'O') rockCount++;
    }
    total += (rowValue*rockCount)
}

console.log(total);