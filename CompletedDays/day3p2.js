var fs = require('fs');
var inputText = fs.readFileSync("./Inputs/input3.txt").toString();
var lineLength = inputText.indexOf('\n');
lines = inputText.split('\n');
lines.pop();

var total = 0;
var gearMatches = {};

var ptrn = /\*/g;

function getKey(index, row) {
    return row + ":" + index;
}

function addToDict(dict, key, value) {
    if (!dict[key]) dict[key] = [];
    dict[key].push(value);
}

for (x = 0; x < lines.length; x++)
{
    line = lines[x];
    var res = [...line.matchAll(/[0-9]+/g)];
    res.forEach(match => {
        let numVal = parseInt(match[0]);

        if(match.index - 1 >= 0) {
            if (line[match.index - 1] == '*') {
                let key = getKey(match.index-1,x);
                addToDict(gearMatches, key, numVal);
            }
        }

        if (match.index + match[0].length < line.length) {
            if (line[match.index + match[0].length] == '*') {
                let key = getKey(match.index+match[0].length,x);
                addToDict(gearMatches, key, numVal);
            }
        }

        sliceStart = (match.index == 0 ? 0 : match.index-1);

        if (x > 0) {
            var slice = lines[x-1].slice(sliceStart, match.index+match[0].length+1)
            sliceMatches = [...slice.matchAll(ptrn)];

            if (sliceMatches != null) {
                sliceMatches.forEach(sm => {
                    let key = getKey(sliceStart + sm.index, x-1);
                    addToDict(gearMatches, key, numVal);
                })
            }
        }

        if (x != lines.length-1) {
            var slice = lines[x+1].slice(sliceStart, match.index+match[0].length+1)
            sliceMatches = [...slice.matchAll(ptrn)];

            if (sliceMatches != null) {
                sliceMatches.forEach(sm => {
                    let key = getKey(sliceStart + sm.index, x+1);
                    addToDict(gearMatches, key, numVal);
                })
            }
        }
    });
}

Object.entries(gearMatches).forEach(gm => {
    if (gm[1].length == 2) {
        total += gm[1][0] * gm[1][1];
    }
})

console.log(total);