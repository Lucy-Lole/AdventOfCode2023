var fs = require('fs');
var inputText = fs.readFileSync("./Inputs/input3.txt").toString();
var lineLength = inputText.indexOf('\n');
lines = inputText.split('\n');
lines.pop();

var total = 0;

var ptrn = /\#|\$|\%|\&|\*|\+|\-|\/|\=|\@/;

for (x = 0; x < lines.length; x++)
{
    line = lines[x];
    var res = [...line.matchAll(/[0-9]+/g)];
    res.forEach(match => {
        let numVal = parseInt(match[0]);

        if(match.index - 1 >= 0) {
            if (line[match.index - 1] != '.') {
                total += numVal;
                return;
            }
        }

        if (match.index + match[0].length < line.length) {
            if (line[match.index + match[0].length] != '.') {
                total += numVal;
                return;
            }
        }

        if (x > 0) {
            var slice = lines[x-1].slice(match.index == 0 ? 0 : match.index-1, match.index+match[0].length+1)
            if (slice.match(ptrn) != null) {
                total += numVal;
                return;
            }
        }

        if (x != lines.length-1) {
            var slice = lines[x+1].slice(match.index == 0 ? 0 : match.index-1, match.index+match[0].length+1)
            if (slice.match(ptrn) != null) {
                total += numVal;
                return;
            }
        }
    });
}

console.log(total);