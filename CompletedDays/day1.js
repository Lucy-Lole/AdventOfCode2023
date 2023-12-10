var fs = require('fs');

var inputText = "";
var numberDict = {'one': 1, 'two': 2, 'three':3, 'four':4, 'five':5, 'six':6, 'seven':7, 'eight':8, 'nine':9}

var data = fs.readFileSync("./Inputs/input1.txt");

inputText = data.toString();

var res = [...inputText.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine))/g)];

var count = 0;

res.forEach(element => {
    inputText = (inputText.slice(0, element.index + count) + numberDict[element[1]] + inputText.slice(element.index + count));
    count++;
});

inputText = inputText.replace(/[A-z]/g,"");

var lines = inputText.split("\n");

var total = 0;

lines.forEach(element => {
    if (element == "")
        return;

    var intVal = 0;
    intVal = parseInt(element[0] + element[element.length-1]);
    total += intVal;
});

console.log(total.toString());