const WINNERS_OF = 54;
const SLOTS_PER_REEL = 10;
// const MAX_SLOTS = `${Object.keys(TIKETS).length}`;
const MIN_SLOTS = '27443';
const MAX_SLOTS = '44168';
const REEL_RADIUS = 123;

let winNumber = [];

function createSlots (ring) {
  let slotAngle = 360 / SLOTS_PER_REEL;

  for (let i = 0; i < SLOTS_PER_REEL; i ++) {
    let slot = document.createElement('div');  
    slot.className = 'slot';
    let transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';
    slot.style.transform = transform;
    let content = $(slot).append('<p>' + (i)+ '</p>');
    ring.append(slot);
  }
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
	// return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spin(timer) {
    let randomNumb = `${getRndInteger(parseInt(MIN_SLOTS), parseInt(MAX_SLOTS))}`;
	let currNumber = randomNumb.padStart(MAX_SLOTS.length, "0");
  for(let i = 1; i < (currNumber.length+1); i ++) {
    let oldSeed = 0;
    /*
    checking that the old seed from the previous iteration is not the same as the current iteration;
    if this happens then the reel will not spin at all
    */
    let oldClass = $('#ring'+i).attr('class');
    oldSeed = parseInt(oldClass.slice(10));


    let seed = currNumber.charAt(i-1);

    if (oldSeed == seed) {
      seed = 9;
      $('#ring'+i).css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's').attr('class','ring spin-' + seed);
    }
    setTimeout(()=>{
	    seed = currNumber.charAt(i-1);
	    $('#ring'+i).css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's').attr('class','ring spin-' + seed);
	    winNumber.push(seed);
    }, 100)
  }
  console.log('=====');
}

function generateSpin(id) {
  return `<div id="ring${id}" class="ring"></div>`
}

function generateWinner(id, prize, ticket, account) {
  return  `<div class="stream-winner win-${WINNERS_OF-id}">`+
                  `<div class="stream-col">${id}</div>`+
                  `<div class="stream-col">$ ${prize}</div>`+
                  `<div class="stream-col">${ticket}</div>`+
                  `<div class="stream-col">${account}</div>`+
            `</div>`;
}

function gettingWinnerAccount (id) {
  for (let key in TIKETS) {
    if (key == parseInt(id)) {
      return TIKETS[key]
    }
  }
}

let counterWinner = 0;

(function() {
  let listWinner = [];

  /* get winners from localStorage if something happens wrong*/
  if (localStorage.getItem('listWinner')) {
      listWinner = JSON.parse(localStorage.getItem('listWinner'));
      counterWinner = listWinner.length;
      $('.stream-randomizer__head .counter').text(counterWinner);
      $('.stream-randomizer__head .prize').text("$" + winPrizes[counterWinner]);

      for (let i = 0; i <  listWinner.length ; i++) {
        $('.stream-userlist__body').prepend(generateWinner(listWinner[i].id, listWinner[i].winnerPrize, listWinner[i].winnerTicket, listWinner[i].winnerAccount));
      }
  }

  /* clear the localStorage*/
  $(document).on('keydown', (event) => {
      if (event.ctrlKey&&event.altKey&&event.key=='7') {
        listWinner = [];
        window.localStorage.removeItem('listWinner')
      }
  });

  /* create slots */
  for (let i = 1; i < (MAX_SLOTS.length+1); i++) {
    $('#rotate').append(generateSpin(i));
    createSlots($('#ring'+i));
  }

  /* Start the lottary*/
  let isStart = false;
  $('.go').on('click',()=> {
    winNumber = [];
    if (!isStart) {
      $('.stream-block-row').addClass('visible');
      $('.go').text('Start spinning');
      $('.stream-randomizer__head').slideDown();
      $('.spiner-head').slideDown();
      if (counterWinner === WINNERS_OF) {
        $('.go').hide();
      }
      isStart = true;
    } else {
      counterWinner++;
      $('.go').attr('disabled', 'disabled');
      $('.stream-randomizer__head .counter').text(counterWinner);
      $('.stream-randomizer__head .prize').text("$" + winPrizes[counterWinner]);
      if (counterWinner === WINNERS_OF) {
        $('.go').hide();
      }

      setTimeout(()=> {
        $('.go').removeAttr('disabled');
        let  winnerObj = {};
        winnerObj.id = counterWinner;
        winnerObj.winnerPrize = winPrizes[counterWinner];
        winnerObj.winnerTicket = winNumber.join('');
        winnerObj.winnerAccount = gettingWinnerAccount(winNumber.join(''));
        listWinner.push(winnerObj);
        window.localStorage.setItem('listWinner',JSON.stringify(listWinner));
        $('.stream-userlist__body').prepend(generateWinner(counterWinner, winPrizes[counterWinner], winNumber.join(''), gettingWinnerAccount(winNumber.join(''))));
      }, 4000);
      spin(2);
    }
  })

  /*parralax blocks*/
  $('.js_plaxify img').plaxify()
  $.plax.enable()

})(); 

