var fs = require('fs');
var lines = fs.readFileSync("./Inputs/input4.txt").toString().replace(/\ {2}/g, ' ').replace(/\ \|\ /g, '|').replace(/:\ /g, ':').split('\n');
lines.pop(); // Remove the empty line


var cards = lines.map((str, index) => ({CardNum:index, WinningNums:str.split(':')[1].split('|')[0].split(' '), HaveNums:str.split(':')[1].split('|')[1].split(' '), Copies:1}));

var totalCardsWon = cards.length;

cards.forEach(card => {
    for (copyNum = 0; copyNum < card.Copies; copyNum++) {
        let runningCardsWon = 0;

        card.HaveNums.forEach(number => {
            if (card.WinningNums.includes(number)) {
                runningCardsWon++;
            }
        })

        for(i = 1; i <= runningCardsWon; i++) {
            cards[card.CardNum+i].Copies++;
        }

        totalCardsWon += runningCardsWon;
    }
})

console.log(totalCardsWon);