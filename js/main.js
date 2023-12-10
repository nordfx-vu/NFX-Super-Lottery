const WINNERS_OF = 75;
const SLOTS_PER_REEL = 10;
const MIN_SLOTS = '61016';
const MAX_SLOTS = '92423';
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
    let rndInteger = getRndInteger(parseInt(MIN_SLOTS), parseInt(MAX_SLOTS));

    while (isNulled(rndInteger)) {
        console.log("-------Nulled------");
        rndInteger = getRndInteger(parseInt(MIN_SLOTS), parseInt(MAX_SLOTS));
    }

    let randomNumb = `${rndInteger}`;
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
    // console.log('=====');
}

function isNulled(rndInteger) {
    for(let key in TICKETS_NULLED){
        if (key == rndInteger) {
            return true;
        }
    }
    return false;
}

function generateSpin(id) {
    return `<div id="ring${id}" class="ring"></div>`
}

function generateWinner(id, prize, ticket, account) {

    return  `<div class="stream-winner win-${WINNERS_OF-id}">`+
        `<div class="stream-col">${id}</div>`+
        `<div class="stream-col ` + getColor(id) + `">$ ${prize}</div>`+
        `<div class="stream-col">${ticket}</div>`+
        `<div class="stream-col">${account}</div>`+
        `</div>`;
}

function getColor(id) {
    var color;
    if (id < 61) {
        color = "turquoise-color";
    }
    if (id > 60 && id < 81) {
        color = "yellow-color";
    }
    if (id > 80 && id < 93) {
        color = "orange-color";
    }
    // if (id > 92) {
    //     color = "orange-color";
    // }
    return color;
}

function gettingWinnerAccount (id) {
    for (let key in TICKETS) {
        if (key == parseInt(id)) {
            return TICKETS[key]
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
                $('.stream-userlist__body').prepend(generateWinner(counterWinner, winPrizes[counterWinner], winNumber.join(''),
                    gettingWinnerAccount(winNumber.join(''))));
                    if (counterWinner === WINNERS_OF) {
                        animateLoop();
                    }
            }, 4000);
            spin(2);
        }
    })

    /*parralax blocks*/
    $('.js_plaxify img').plaxify()
    $.plax.enable()

})();

// fireworks //
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

var smokeArray = []

function SmokeCircle(x,y,radius,volX,volY,alphaValue,R,G,B){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.volX = volX;
    this.volY = volY;
    this.R = R;
    this.G = G;
    this.B = B;
    this.alphaValue = alphaValue;
    this.erase = false;

    this.draw = function(){
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + this.R + ',' + this.G + ',' + this.B + ',' + this.alphaValue + ")";
        ctx.arc(this.x,this.y,this.radius,Math.PI * 2, 0, false);
        ctx.fill();
    }
    this.update = function(){

        this.alphaValue -= 0.02;

        if(this.alphaValue == 0 || this.alphaValue < 0){
            this.erase = true;
        }

        if(this.volX > 0){
            this.volX -= 0.1;
        } else if(this.volX < 0){
            this.volX += 0.1;
        }
        if(this.volY > 0){
            this.volY -= 0.1;
        } else if(this.volY < 0){
            this.volY += 0.1;
        }


        this.x += this.volX;
        this.y -= this.volY;
        this.draw();
    }
    this.update();

}

function Rocket(x,y,width,height,yVol,R,G,B){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.yVol = yVol;
    this.R = R;
    this.G = G;
    this.B = B;
    this.boom = false;

    this.draw = function(){
        ctx.fillStyle = "rgb(" + this.R + ',' + this.G + ',' + this.B + ")";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    this.update = function(){
        this.y -= this.yVol;
        if(this.y < 200 + Math.floor(Math.random() * 10)){
            this.boom = true;

            for(var i = 0; i < 40; i++){
                var radius = Math.floor(Math.random() * 8);
                var volXSwitch = Math.floor(Math.random() * 2);
                var volYSwitch = Math.floor(Math.random() * 2);
                var vol = {x: undefined, y: undefined};
                if(volXSwitch == 0){
                    vol.x = Math.floor(Math.random() * 5) + 2;
                } else {
                    vol.x = Math.floor(Math.random() * -5) + -2;
                }
                if(volYSwitch == 0){
                    vol.y = Math.floor(Math.random() * 7) + 1.5;
                } else {
                    vol.y = Math.floor(Math.random() * -7) + -1.5;
                }
                var yVol = (Math.random() * 3) + 2.5;
                smokeArray.push(new SmokeCircle(
                    this.x,
                    this.y,
                    radius,
                    vol.x,
                    vol.y,
                    1,
                    this.R,
                    this.G,
                    this.B
                ));
            }
            rocketArray.push(new Rocket(
                Math.random() * canvas.width,
                canvas.height,
                (Math.random() * 2) + 3,
                (Math.random() * 5) + 5,
                (Math.random() * 6) + 4,
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)

            ));
        }
        this.draw();
    }
    this.update();
}


// Making Rocket

var rocketArray = [];

for(var j = 0; j < 15; j++){
    var x = Math.random() * canvas.width;
    var y = canvas.height;
    var width = (Math.random() * 2) + 3;
    var height = (Math.random() * 5) + 5;
    var yVol = (Math.random() * 6) + 4;
    var R = Math.floor(Math.random() * 255);
    var G = Math.floor(Math.random() * 255);
    var B = Math.floor(Math.random() * 255);

    rocketArray.push(new Rocket(x,y,width,height,yVol,R,G,B));
}

function animateLoop(){
    requestAnimationFrame(animateLoop);
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for(var i = 0; i < smokeArray.length; i++){
        smokeArray[i].update();
    }
    for(var j = 0; j < rocketArray.length; j++){
        rocketArray[j].update();
    }

    rocketArray = rocketArray.filter(object => !object.boom);
    smokeArray = smokeArray.filter(object => !object.erase);
}

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
