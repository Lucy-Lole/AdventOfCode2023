let fs = require('fs');
let steps = fs.readFileSync("./Inputs/input15.txt").toString().split(',');

function HASH(str) {
    let startValue = 0;
    for (let i=0;i<str.length;i++) {
        startValue += str.charCodeAt(i);
        startValue *= 17;
        startValue %= 256;
    }
    return startValue;
}

let total = 0;

steps.forEach(step => total += HASH(step));

console.log(total);