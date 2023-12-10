var fs = require('fs');
var lines = fs.readFileSync("./Inputs/input4.txt").toString().replace(/\ {2}/g, ' ').replace(/\ \|\ /g, '|').replace(/:\ /g, ':').split('\n');
lines.pop(); // Remove the empty line


var cards = lines.map((str, index) => ({CardNum:index+1, WinningNums:str.split(':')[1].split('|')[0].split(' '), HaveNums:str.split(':')[1].split('|')[1].split(' ')}));

var totalScore = 0;

cards.forEach(card => {
    let runningScore = 0;

    card.HaveNums.forEach(number => {
        if (card.WinningNums.includes(number)) {
            runningScore += (runningScore == 0 ? 1 : runningScore);
        }
    })
    totalScore += runningScore;
})

console.log(totalScore);