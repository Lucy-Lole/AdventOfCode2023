let fs = require('fs');
let lines = fs.readFileSync("./Inputs/day12example.txt").toString().split('\n').map(x => ({springs:x.split(' ')[0], nums:x.split(' ')[1].split(',')}));
let totalLines = lines.length;
var dict = {};

for (let a=0;a<lines.length;a++) {
    let text = lines[a].springs;
    let tmpNums = lines[a].nums;
    lines[a].springs = text + '?' + text + '?' + text + '?' + text + '?' + text;
    for(var b = 1; b<5;++b){
        lines[a].nums = [...lines[a].nums, ...tmpNums];
      }
}

function isArramgementLegal(line) {
    let blocks = [];
    let currentBlock = "";

    for (let i=0;i<=line.length;i++) {
        if (i == line.length) {
            if (currentBlock != "") {
                blocks.push(currentBlock);
            }
            break;
        }

        let char = line[i];
        if (char == '.') {
            if (currentBlock != "") {
                blocks.push(currentBlock);
                currentBlock = "";
            }
        }
        else {
            currentBlock += char;
        }
    }

    if (blocks.length != lines[currentLineNumber].nums.length) {
        return false;
    }

    for (let i=0;i<lines[currentLineNumber].nums.length;i++) {
        if (lines[currentLineNumber].nums[i] != blocks[i].length) return false;
    }

    return true;
}

function doctorStrange(springs) {
    let key = springs + lines[currentLineNumber].nums.toString();
    if (dict[key] != null) return dict[key];

    if (springs.includes('?')) {
        let fixedReality = springs.replace('?', '.');
        let brokenReality = springs.replace('?', '#');

        let value = (doctorStrange(fixedReality) + doctorStrange(brokenReality));
        dict[key] = value;
        return value;
    }
    else {
        return isArramgementLegal(springs)
    }
}

let totalArrangements = 0;
var currentLineNumber = 0;

for(;currentLineNumber<lines.length;currentLineNumber++) {
    let lineArrangements = doctorStrange(lines[currentLineNumber].springs);

    totalArrangements += lineArrangements;
    let percentage = (currentLineNumber/totalLines * 100).toString().slice(0,2);
    console.log("Completion: " + percentage + "% | Current total: " + totalArrangements);
}

console.log(totalArrangements);