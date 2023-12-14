let fs = require('fs');
let grid = fs.readFileSync("./Inputs/input14.txt").toString().split('\n').map(x => [...x]);

for(let y=1;y<grid.length;y++) {
    for (let x=0;x<grid[y].length;x++) {
        if (grid[y][x] == 'O') {
            let tmpY = y-1;
            while (tmpY > -1) {
                if (grid[tmpY][x] == '.') {
                    grid[tmpY][x] = 'O';
                    grid[tmpY+1][x] = '.';
                    tmpY--;
                }
                else{
                    break;
                }
            }
        }
    }
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