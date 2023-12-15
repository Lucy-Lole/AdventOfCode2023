let fs = require('fs');
let steps = fs.readFileSync("./Inputs/input15.txt").toString().split(',');
let HASHMAP = [...Array(256)].map(a => Array());

function HASH(str) {
    let startValue = 0;
    for (let i=0;i<str.length;i++) {
        startValue += str.charCodeAt(i);
        startValue *= 17;
        startValue %= 256;
    }
    return startValue;
}

for (let stepNum = 0; stepNum < steps.length;stepNum++) {
    let step = steps[stepNum];
    let labal = step.match(/[A-z]+/g)[0];
    let box = HASH(labal);
    let currentLoc = HASHMAP[box].findIndex(x => x.labal == labal);
    if (step.includes('-')) {
        // Remove from box
        if (currentLoc != -1) HASHMAP[box] = [...HASHMAP[box].slice(0, currentLoc), ...HASHMAP[box].slice(currentLoc+1)];
    }
    else if (step.includes('=')) {
        // Get focal length
        let focal = step.slice(-1);
        // Add to box or update
        if (currentLoc != -1) {
            HASHMAP[box][currentLoc].focalLength = focal;
        }
        else {
            HASHMAP[box].push({labal:labal, focalLength:focal});
        }
    }
}

let focussingPower = 0;

for (let box = 0; box < HASHMAP.length; box++) {
    for (let lens = 0; lens < HASHMAP[box].length; lens++) {
        focussingPower += ((1 + box) * (lens+1)) * HASHMAP[box][lens].focalLength;
    }
}

console.log(focussingPower);