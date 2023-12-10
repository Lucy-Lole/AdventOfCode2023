var fs = require('fs');

function getColoursFromListOfReveals(array) {
    var returnArr = new Array();

    array.forEach(element => {
        let reveal = element.split(',');
        var entry = new Object();

        reveal.forEach(cubes => {
            if (cubes.includes("red")) {
                entry.red = parseInt(cubes.replace("red", ""));
            }
            else if (cubes.includes("blue")) {
                entry.blue = parseInt(cubes.replace("blue", ""));
            }
            else if (cubes.includes("green")) {
                entry.green = parseInt(cubes.replace("green", ""));
            }
        });

        returnArr.push(entry);
    });

    return returnArr;
}

var data = fs.readFileSync("./Inputs/input2.txt");

const MAX_RED = 12; const MAX_GREEN = 13; const MAX_BLUE = 14;

var strings = [...data.toString().split("\n")];
strings.pop("\n");

var games = strings.map((str, index) => ({ reveals: getColoursFromListOfReveals(str.split(':')[1].split(';')), ID: index + 1 }))
var total = 0;

games.forEach(element => {
    var impossible = false;
    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;
    element.reveals.forEach(x => {
        if (x.red > minRed)
            minRed = x.red;
        if (x.green > minGreen)
            minGreen = x.green;
        if (x.blue > minBlue)
            minBlue = x.blue;
    })

    total += (minRed*minGreen*minBlue)
});

console.log(total);

