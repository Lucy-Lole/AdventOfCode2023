let fs = require('fs');
let blocks = fs.readFileSync("./Inputs/input13.txt").toString().split('\n\n').map(x => x.split('\n'));
let horiReflections = [];
let vertReflections = [];

function getVerticalColumn(grid, col) {
    returnArr = [];
    for (let x=0;x<grid.length;x++) {
        returnArr.push(grid[x].slice(col,col+1));
    }

    return returnArr.toString();
}

for(let i=0;i<blocks.length;i++){
    let block = blocks[i];
    let hasVertReflection = false;

    // Check horizontal reflections
    for(let j=0;j<block.length-1;j++) {
        if (block[j] == block[j+1]) {
            let a = j-1;
            let b = j+2;
            let hasHoriReflection = true;
            while (a > -1 && b < block.length && hasHoriReflection == true) {
                if (block[a] != block[b]) {
                    hasHoriReflection = false;
                }
                a--;
                b++;
            }

            if (hasHoriReflection) {
                horiReflections.push(j+1);
                break;
            }
        }
    }

    // Check vertical reflections
    for(let j=0;j<block[0].length-1;j++) {
        let leftCol = getVerticalColumn(block,j);
        let rightCol = getVerticalColumn(block,j+1);
        if (leftCol == rightCol) {
            let a = j-1;
            let b = j+2;
            let hasVertReflection = true;
            while (a > -1 && b < block[0].length && hasVertReflection == true) {
                if (getVerticalColumn(block,a) != getVerticalColumn(block,b)) {
                    hasVertReflection = false;
                }
                a--;
                b++;
            }

            if (hasVertReflection) {
                vertReflections.push(j+1);
                break;
            }
        }
    }
}

console.log((100*(horiReflections.reduce((acc, x) => acc += x,0))) + vertReflections.reduce((acc, x) => acc += x,0));