let fs = require('fs');
let lines = fs.readFileSync("./Inputs/input12.txt").toString().split('\n').map(x => ({springs:x.split(' ')[0], nums:x.split(' ')[1].split(',')}));

function isArramgementLegal(line, nums) {
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

    if (blocks.length != nums.length) {
        return false;
    }

    for (let i=0;i<nums.length;i++) {
        if (nums[i] != blocks[i].length) return false;
    }

    return true;
}

function doctorStrange(springs) {
    if (springs.includes('?')) {
        let fixedReality = springs.replace('?', '.');
        let brokenReality = springs.replace('?', '#');

        return [...doctorStrange(fixedReality), ...doctorStrange(brokenReality)];
    }
    else {
        return [springs];
    }
}

let totalArrangements = 0;

for(let i=0;i<lines.length;i++) {
    let possibilities = doctorStrange(lines[i].springs);
    let lineArrangements = 0;
    let currNums = lines[i].nums;

    for (let j=0;j<possibilities.length;j++) {
        if (isArramgementLegal(possibilities[j], currNums)) {
            lineArrangements++;
        }
    }

    totalArrangements += lineArrangements;
}

console.log(totalArrangements);