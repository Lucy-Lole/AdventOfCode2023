let fs = require('fs');
let values = fs.readFileSync("./Inputs/input9.txt").toString().split('\n').map(x => x.split(' ').map(y => parseInt(y)));
function getNextValueDelta(series) {
    let newSeries = [];
    for (i=0;i<series.length-1;i++) {
        newSeries.push(series[i+1]-series[i]);
    }

    if (newSeries.every(x => x == 0)) return 0;
    else return newSeries[newSeries.length-1] + getNextValueDelta(newSeries);
}

let result = values.reduce((accumulator, currentValue) => accumulator + currentValue[currentValue.length-1] + getNextValueDelta(currentValue), 0);

console.log(result);