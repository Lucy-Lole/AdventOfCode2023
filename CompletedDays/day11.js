let fs = require('fs');
let startingGrid = fs.readFileSync("./Inputs/input11.txt").toString().split('\n').map(x => x.split(''));
let galaxies = [];
let nextGalaxyID = 0;
let emptyRows = [...Array(startingGrid.length).keys()];
let emptyCols = [...Array(startingGrid[0].length).keys()];

// Find the galaxies and empty rows
for (y=0;y<startingGrid.length;y++) {
    for (x=0;x<startingGrid[y].length;x++) {
        if (startingGrid[y][x] == '#') {
            galaxies.push({ID:nextGalaxyID, y:y, x:x, galaxiesPaired:[]});
            nextGalaxyID++;
            delete emptyRows[emptyRows.indexOf(y)];
            delete emptyCols[emptyCols.indexOf(x)];
        }
    }
}

let expansionSize = 1000000 - 1;

// Expand the galaxies
for(i=0;i<galaxies.length;i++) {
    let rowOffset = 0;
    let colOffset = 0;
    let tmpGal = galaxies[i];

    emptyRows.forEach(a => {
        if ((a + rowOffset) > tmpGal.y) return;
        else {
            tmpGal.y += expansionSize;
            rowOffset += expansionSize;
        }
    })

    emptyCols.forEach(a => {
        if ((a + colOffset) > tmpGal.x) return;
        else {
            tmpGal.x += expansionSize;
            colOffset += expansionSize;
        }
    })
}

let total = 0;

for(i=0;i<galaxies.length;i++) {
    for (j=0;j<galaxies.length;j++) {
        if (galaxies[i] !== galaxies[j] && !galaxies[j].galaxiesPaired.includes(galaxies[i].ID)) {
            galaxies[i].galaxiesPaired.push(galaxies[j].ID);
            galaxies[j].galaxiesPaired.push(galaxies[i].ID);
            total += (Math.abs(galaxies[i].x - galaxies[j].x) + Math.abs(galaxies[i].y-galaxies[j].y));
        }
    }
}

console.log(total);