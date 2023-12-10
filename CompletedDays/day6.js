var fs = require('fs');
var lines = fs.readFileSync("./Inputs/input6.txt").toString().replace(/\n/g,',').replace(/ +/g,',').split(',');
var times = [lines[1] + lines[2] + lines[3] + lines[4]].map(x=>parseInt(x));
var distances = [lines[6] + lines[7] + lines[8] + lines[9]].map(x=>parseInt(x));
let total = 1;
for (x=0;x<times.length;x++) {
    let ways = 0;
    let time = times[x];
    for (i=0;i<time;i++) {
        if (i * (time-i) > distances[x]) {
            ways++;
        }
    }
    total = total * ways;
}

console.log(total);