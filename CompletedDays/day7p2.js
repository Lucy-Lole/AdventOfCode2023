var fs = require('fs');
var hands = fs.readFileSync("./Inputs/input7.txt").toString().split('\r\n').map(x => x.split(' ')).map(x => ({value:getTredecimalValue(x[0]), bid:x[1]}));

function getTredecimalValue(string) {
    string = determineTier(string) + string;
    return parseInt(string.replace(/A/g,'D').replace(/J/g,'0').replace(/Q/g,'B').replace(/K/g,'C').replace(/T/g,'A'), 16);
}

function determineTier(string) {
    let characters = {};
    for (i=0;i<string.length;i++) {
        let char = string[i];
        if (char in characters) characters[char]++;
        else characters[char] = 1;
    }
    if (Object.keys(characters).includes('J') && characters.J != 5) {
        let jVal = characters.J;
        delete characters.J;
        characters[Object.entries(characters).sort((a,b)=>b[1]-a[1])[0][0]] += jVal;
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

hands = hands.sort((a,b) => a.value-b.value);

console.log(hands.map((x,index) => x.bid*(index+1)).reduce((accumulator, a) => accumulator + a, 0));