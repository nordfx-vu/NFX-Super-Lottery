const confPrizes = {60: 250, 62: 1000, 72: 1800, 75: 5000};
let winPrizes = {};

for(let i = 0; i < Object.keys(confPrizes).length; i++) {
    createWinPrizeList(Object.keys(confPrizes)[i - 1], Object.keys(confPrizes)[i], Object.values(confPrizes)[i]);
}

// console.log(winPrizes);

function createWinPrizeList (from, to, value) {
    from = from === undefined? 0 : parseInt(from);
    to = parseInt(to);

    for(let i = from; i < to; i++) {
        winPrizes[i + 1] = value;
    }
}