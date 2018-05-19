let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const selectors = document.querySelectorAll('[data-time]');
let secondsLeft = 0;
let paused = true;
// const stopBtn = document.getElementById('stopBtn');
const audio =  new Audio('static/ding.ogg');
const audioFin = new Audio('static/deneb.ogg');
const origColor = 'linear-gradient(45deg, #42a5f5 0%, #478ed1 50%, #0d47a1 100%)';
const oneMinColor = 'linear-gradient(45deg, #a90329 0%,#8f0222 50%,#6d0019 100%)';
const threeMinColor = 'linear-gradient(45deg, #eab92d 0%,#c79810 50%,#c79810 100%)';
const zeroMinColor = 'linear-gradient(45deg, #f2825b 0%, #e55b2b 50%, #f07146 100%)';

function timer(seconds) {
    //Clear existing timers
    clearInterval(countdown);
    //Unpause & stop blinking
    timerDisplay.classList.remove('blink');
    paused = false;

    const now = Date.now();
    const then = now + 1000*seconds //Turn seconds to ms
    // console.log(now,then);
    countdown = setInterval(() =>{
        secondsLeft = Math.round((then - Date.now())/1000);
        // Check if it is over
        if(secondsLeft <=0){
            document.body.style.background = zeroMinColor;
            audioFin.play();
            clearInterval(countdown);
            displayTimeLeft(0);
            selectors.forEach(button => button.disabled = false);
            return;
        } else if (secondsLeft <=60){
            document.body.style.background = oneMinColor;
        } else if(secondsLeft<=180) {
            document.body.style.background = threeMinColor;
        }
        if (secondsLeft==60 || secondsLeft==180){
            audio.play();
        }
        //display
        displayTimeLeft(secondsLeft);
    },500);
}

function displayTimeLeft(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds %60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0':''}${remainderSeconds}`;
    timerDisplay.textContent = display;
    //Change tab title
    document.title = display;    
}

function startTimer(){
    const seconds = parseInt(this.dataset.time);
    if(seconds>=0){
        document.body.style.background = origColor;
    }
    selectors.forEach(button => button.disabled= true);
    timer(seconds);
}

function stopTimer(){
    clearInterval(countdown);
    secondsLeft = 0;
    displayTimeLeft(0);
    paused = true;
    timerDisplay.classList.remove('blink');
    document.body.style.background = origColor;
    selectors.forEach(button => button.disabled= false);
}

function pauseTimer() {
    if(paused){
        timer(secondsLeft);
    }
    else{
        paused = true;
        clearInterval(countdown);
        timerDisplay.classList.add('blink');
    }
    // document.body.style.background = origColor;
    // selectors.forEach(button => button.disabled = false);
}

selectors.forEach(button => button.addEventListener('click',startTimer));
document.customForm.addEventListener('submit',function(e){
    e.preventDefault();
    const mins = this.minutes.value;
    if (mins > 1) {
        document.body.style.background = origColor;
    }
    timer(mins*60);
    selectors.forEach(button => button.disabled = true);
    this.reset();
});

stopBtn.addEventListener('click',stopTimer);
pauseBtn.addEventListener('click', pauseTimer);