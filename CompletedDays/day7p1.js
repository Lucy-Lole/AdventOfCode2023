var fs = require('fs');
var hands = fs.readFileSync("./Inputs/input7.txt").toString().split('\n').map(x => x.split(' ')).map(x => ({value:getTredecimalValue(x[0]), bid:x[1]}));

function getTredecimalValue(string) {
    let treDecimalStirng = "";
    for (i=0;i<string.length;i++) {
        let char = string[i];
        if (!isNaN(parseInt(char))) {
            treDecimalStirng += (parseInt(char)-2).toString();
        }
        else if (char == 'T') treDecimalStirng += "8";
        else if (char == 'J') treDecimalStirng += "9";
        else if (char == 'Q') treDecimalStirng += "A";
        else if (char == 'K') treDecimalStirng += "B";
        else if (char == 'A') treDecimalStirng += "C";
    }

    treDecimalStirng = determineTier(string) + treDecimalStirng;

    return parseInt(treDecimalStirng, 13);
}

function determineTier(string) {
    let characters = {};
    for (i=0;i<string.length;i++){
        let char = string[i];
        if (char in characters) characters[char]++;
        else characters[char] = 1;
    }
    let vals = Object.values(characters);

    if (vals.includes(5)) return 6;
    else if (vals.includes(4)) return 5;
    else if (vals.includes(3)) {
        if (vals.includes(2)) return 4;
        else return 3;
    }
    else if (vals.includes(2)) {
        if (Object.keys(characters).length == 3) return 2;
        else return 1;
    }
    else return 0;
}

let total = 0;

hands = hands.sort((a,b) => a.value-b.value);

total = hands.map((x,index) => x.bid*(index+1)).reduce((accumulator, a) => accumulator + a, 0);

console.log(total);