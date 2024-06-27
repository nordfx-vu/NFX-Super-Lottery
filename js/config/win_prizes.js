const confPrizes = {40: 250, 50: 500, 55: 750, 56: 1250};
let winPrizes = {};

for(let i = 0; i < Object.keys(confPrizes).length; i++) {
    createWinPrizeList(Object.keys(confPrizes)[i - 1], Object.keys(confPrizes)[i], Object.values(confPrizes)[i]);
}

function createWinPrizeList (from, to, value) {
    from = from === undefined? 0 : parseInt(from);
    to = parseInt(to);

    for(let i = from; i < to; i++) {
        winPrizes[i + 1] = value;
    }
}