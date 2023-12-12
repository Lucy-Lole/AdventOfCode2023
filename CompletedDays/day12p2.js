let fs = require('fs');
let lines = fs.readFileSync("./Inputs/input12.txt").toString().split('\n').map(x => ({springs:x.split(' ')[0], nums:x.split(' ')[1].split(',').map(y=>parseInt(y))}));
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

function doctorStrange(springs, nums, inGroup) {
    let key = springs + nums.toString() + (inGroup ? 't' : 'f');
    if (dict[key] != null) {
        return dict[key];
    }

    if (nums.length == 0 ||
     (springs == "" && nums.length == 1 && nums[0] == 0))
    {
        if (springs.includes('#')) return 0;
        else return 1;
    }
    else if (springs.length == 0 && nums.length != 0) {
        return 0;
    }

    let firstChar = springs[0];
    if (nums[0] == 0 && firstChar == '#') return 0;

    let value = 0;
    if (firstChar == '.') {
        if (inGroup && nums[0] != 0) {
            return 0;
        }

        if (nums[0] == 0){
            value = doctorStrange(springs.slice(1), nums.slice(1), inGroup);
        }
        else {
            value = doctorStrange(springs.slice(1), nums, inGroup);
        }
    }
    else if (firstChar == '?') {
        let fixedReality = springs.replace('?', '.');
        let brokenReality = springs.replace('?', '#');

        value = (doctorStrange(fixedReality, [...nums], inGroup) + doctorStrange(brokenReality, [...nums], inGroup));
    }
    else if (firstChar == '#') {
        if (nums[0] == 1) {
            value = doctorStrange(springs.slice(1), [nums[0]-1, ...nums.slice(1)], false);
        }
        else {
            value = doctorStrange(springs.slice(1), [nums[0]-1, ...nums.slice(1)], true);
        }
    }

    dict[key] = value;
    return value;
}

let totalArrangements = 0;
var currentLineNumber = 0;

for(;currentLineNumber<lines.length;currentLineNumber++) {
    let lineArrangements = doctorStrange(lines[currentLineNumber].springs, lines[currentLineNumber].nums, false);

    totalArrangements += lineArrangements;
    let percentage = ((currentLineNumber+1)/totalLines * 100).toString().slice(0,4);
    console.log("Completion: " + percentage + "% | This delta: " + lineArrangements + " | Current total: " + totalArrangements);
}

console.log(totalArrangements);