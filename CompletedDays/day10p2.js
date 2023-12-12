let fs = require('fs');
let pipeMap = fs.readFileSync("./Inputs/input10.txt").toString().split('\n').map(x => x.split(''));
let dir = { up:'up', down:'down', left:'left', right:'right'};
let loopSize = 0;
let points = [];

function getNextTile(direction, currentLocation) {
    let nextLocation;
    let nextDirection = direction;
    points.push(currentLocation);

    let tileContent = pipeMap[currentLocation.y][currentLocation.x];

    switch (tileContent) {
        case '|':
            nextLocation = {y:(currentLocation.y + (direction == dir.down ? 1 : -1)), x:currentLocation.x};
            break;
        case '-':
            nextLocation = {y:currentLocation.y, x:(currentLocation.x + (direction == dir.right ? 1 : -1))};
            break;
        case 'L':
            if (direction == dir.left) {
                nextLocation = {y:currentLocation.y - 1, x:currentLocation.x};
                nextDirection = dir.up;
            }
            else {
                nextLocation = {y:currentLocation.y, x:currentLocation.x+1};
                nextDirection = dir.right;
            }
            break;
        case 'J':
            if (direction == dir.right) {
                    nextLocation = {y:currentLocation.y - 1, x:currentLocation.x};
                    nextDirection = dir.up;
                }
            else {
                    nextLocation = {y:currentLocation.y, x:currentLocation.x-1};
                    nextDirection = dir.left;
                }
            break;
        case '7':
            if (direction == dir.right) {
                    nextLocation = {y:currentLocation.y + 1, x:currentLocation.x};
                    nextDirection = dir.down;
                }
            else {
                    nextLocation = {y:currentLocation.y, x:currentLocation.x-1};
                    nextDirection = dir.left;
                }
            break;
        case 'F':
            if (direction == dir.left) {
                    nextLocation = {y:currentLocation.y + 1, x:currentLocation.x};
                    nextDirection = dir.down;
                }
            else {
                    nextLocation = {y:currentLocation.y, x:currentLocation.x+1};
                    nextDirection = dir.right;
                }
            break;
        default:
            return null;
    }

    return {nextDir:nextDirection, nextLoc:nextLocation};
}

// Find location of S
let sLoc;
for (y=0;y<pipeMap.length;y++) {
    if (sLoc != null) break;

    for (x=0;x<pipeMap[y].length;x++) {
        if (pipeMap[y][x] == 'S') {
            sLoc = {y:y, x:x};
            break;
        }
    }
}

let startLoc;
let startDir;
// Find our start on the loop
if (pipeMap[sLoc.y][sLoc.x+1] == '7' || pipeMap[sLoc.y][sLoc.x+1] == '-' || pipeMap[sLoc.y][sLoc.x+1] == 'J') {
    startLoc = {y:sLoc.y, x:sLoc.x+1};
    startDir = dir.right;
}
else if (pipeMap[sLoc.y+1][sLoc.x] == 'L' || pipeMap[sLoc.y+1][sLoc.x] == '|' || pipeMap[sLoc.y+1][sLoc.x] == 'J') {
    startLoc = {y:sLoc.y+1, x:sLoc.x};
    startDir = dir.down;
}
else if (pipeMap[sLoc.y][sLoc.x-1] == 'L' || pipeMap[sLoc.y][sLoc.x-1] == '-' || pipeMap[sLoc.y][sLoc.x-1] == 'F') {
    startLoc = {y:sLoc.y, x:sLoc.x-1};
    startDir = dir.left;
}
else if (pipeMap[sLoc.y-1][sLoc.x] == '7' || pipeMap[sLoc.y-1][sLoc.x] == '|' || pipeMap[sLoc.y-1][sLoc.x] == 'F') {
    startLoc = {y:sLoc.y-1, x:sLoc.x};
    startDir = dir.up;
}

nextMovement  = {nextDir:startDir, nextLoc:startLoc};

// Find the loop length
while (nextMovement != null) {
    loopSize++;
    nextMovement = getNextTile(nextMovement.nextDir, nextMovement.nextLoc);
}

let area = 0;

// Do shoelace
for (i=0;i<points.length;i++) {
    let x1 = points[i].x;
    let x2 = (i == points.length-1 ? points[0].x : points[i+1].x);

    let y1 = points[i].y;
    let y2 = (i == points.length-1 ? points[0].y : points[i+1].y);

    area += ((x1*y2) - (x2*y1));
}

area = area/2;

// Do pick
let interiorPoints = Math.abs(area) - (points.length/2) + 1;

console.log("Furthest distance on loop: " + loopSize/2);
console.log("Interior Size: " + interiorPoints);