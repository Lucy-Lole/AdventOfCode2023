let fs = require('fs');
let blocks = fs.readFileSync("./Inputs/input13.txt").toString().split('\n\n').map(x => x.split('\n'));
let horiReflections = [];
let vertReflections = [];

function getVerticalColumn(grid, col) {
    let returnStr = "";
    for (let x=0;x<grid.length;x++) {
        returnStr += grid[x].slice(col,col+1);
    }

    return [...returnStr].reverse().join("");
}

function getSingleDifferenceLoc(a, b) {
    let differenceCount = 0;
    let differenceLoc = -1;
    for(let l=0;l<a.length;l++) {
        if (a[l] != b[l]) {
            differenceCount++;
            differenceLoc = l;
        }
    }

    return differenceCount == 1 ? differenceLoc : null;
}

function cloneArray(array, rotate) {
    let returnArr = [];
    if (rotate) {
        for(let col=0;col<array[0].length;col++) {
            returnArr.push(getVerticalColumn(array, col));
        }
    }
    else {
        for (let p=0;p<array.length;p++) {
            returnArr.push(array[p].split('').join(''));
        }
    }
    return returnArr;
}

function findReflection(block, allowSmudgeChecking, whereWeWantToFindIt) {
    for(let j=0;j<block.length-1;j++) {
        if (block[j] == block[j+1] || getSingleDifferenceLoc(block[j], block[j+1]) != null) {
            let a = j;
            let b = j+1;
            let diffOnFirstLines = (getSingleDifferenceLoc(block[j], block[j+1]) != null);

            /*
            if ((j-1 < 0 || j+2 >= block.length) && (getSingleDifferenceLoc(block[j], block[j+1] != null))) {
                return j;
            }*/
            if (whereWeWantToFindIt != null && j != whereWeWantToFindIt) continue;

            let hasReflection = true;
            while (a > -1 && b < block.length && hasReflection == true) {
                if (block[a] != block[b]) {
                    let diffLoc = getSingleDifferenceLoc(block[a], block[b]);
                    if (allowSmudgeChecking && diffLoc != null) {
                        let newArr = cloneArray(block);
                        newArr[a] = newArr[a].slice(0,diffLoc) + block[b][diffLoc] + newArr[a].slice(diffLoc+1) ;
                        let newRef = findReflection(newArr, false, j);
                        if (newRef != null && newRef == j) return newRef;
                    }
                    else {
                        hasReflection = false;
                    }
                }
                a--;
                b++;
            }
            if (hasReflection && !allowSmudgeChecking) return j;
        }
    }
}

let blockIDs = [];

for(let i=0;i<blocks.length;i++){
    let block = blocks[i];

    // Check horizontal reflections
    let horiRef = findReflection(block, true, null);

    if (horiRef != null) {
        horiReflections.push(horiRef+1);
        blockIDs.push(i);
    }

    // Check vertical reflections
    let vertRef = findReflection(cloneArray(block, true), true, null);

    if (vertRef != null) {
        vertReflections.push(vertRef+1);
        blockIDs.push(i);
    }
}

console.log((100*(horiReflections.reduce((acc, x) => acc += x,0))) + vertReflections.reduce((acc, x) => acc += x,0));