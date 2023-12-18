let fs = require('fs');
let grid = fs.readFileSync("./Inputs/input16.txt").toString().split('\n').map(x => x.split(''));
let energyGrid = [...Array(grid.length)].map(x => Array(grid[0].length));
let directions = {left:0,up:1,right:2,down:3};

let placesWeveBeen = {};

function traverse(position, direction) {
    if (position.y >= grid.length || position.y < 0 || position.x  >= grid[position.y].length || position.x < 0) return;
    
    let key = position.x.toString() + '|' +  position.y.toString() + '|' + direction.toString();
    if (placesWeveBeen[key] != null) return;
    else placesWeveBeen[key] = true;

    let char = grid[position.y][position.x];
    energyGrid[position.y][position.x] = '#';
    
    if (char == '\\') {
        switch(direction) {
            case directions.left:
                direction = directions.up;
                break;
            case directions.up:
                direction = directions.left;
                break;
            case directions.right:
                direction = directions.down;
                break;
            case directions.down:
                direction = directions.right;
                break;
        }
    }
    else if (char == '/') {
        switch(direction) {
            case directions.left:
                direction = directions.down;
                break;
            case directions.up:
                direction = directions.right;
                break;
            case directions.right:
                direction = directions.up;
                break;
            case directions.down:
                direction = directions.left;
                break;
        }
    }
    else if (char == '-') {
        if (direction != directions.left && direction != directions.right) {
            traverse({y:position.y, x:position.x-1}, directions.left);
            traverse({y:position.y, x:position.x+1}, directions.right);
            return;
        }
    }
    else if (char == '|') {
        if (direction != directions.up && direction != directions.down) {
            traverse({y:position.y-1, x:position.x}, directions.up);
            traverse({y:position.y+1, x:position.x}, directions.down);
            return;
        }
    }

    let newPos = {y:position.y,x:position.x};

    // Get new pos
    switch (direction) {
        case directions.left:
            newPos.x--;
            break;
        case directions.up:
            newPos.y--;
            break;
        case directions.right:
            newPos.x++;
            break;
        case directions.down:
            newPos.y++;
            break;
    }

    return traverse(newPos, direction);
}

let totalEnergies = [];

for (let i =0;i<grid.length;i++){
    let startPosition = {y:i,x:0};
    let startDirection = directions.right;
    placesWeveBeen = {};
    traverse(startPosition, startDirection, 0);
    totalEnergies.push((energyGrid.toString().match(/#/g)||[]).length);
    energyGrid = [...Array(grid.length)].map(x => Array(grid[0].length));

    startPosition = {y:i,x:grid[i].length-1};
    startDirection = directions.left;
    placesWeveBeen = {};
    traverse(startPosition, startDirection, 0);
    totalEnergies.push((energyGrid.toString().match(/#/g)||[]).length);
    energyGrid = [...Array(grid.length)].map(x => Array(grid[0].length));

    startPosition = {y:0,x:i};
    startDirection = directions.down;
    placesWeveBeen = {};
    traverse(startPosition, startDirection, 0);
    totalEnergies.push((energyGrid.toString().match(/#/g)||[]).length);
    energyGrid = [...Array(grid.length)].map(x => Array(grid[0].length));

    startPosition = {y:grid.length-1,x:i};
    startDirection = directions.up;
    placesWeveBeen = {};
    traverse(startPosition, startDirection, 0);
    totalEnergies.push((energyGrid.toString().match(/#/g)||[]).length);
    energyGrid = [...Array(grid.length)].map(x => Array(grid[0].length));
}

let max = 0;
totalEnergies.forEach(x => {max = x > max ? x : max;})

console.log(max);