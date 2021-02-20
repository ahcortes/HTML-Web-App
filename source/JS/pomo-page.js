const activebutton = document.getElementById('pomo-button');
const activetimer = document.getElementById('timer');
const activebar = document.getElementById('progress-bar');

const breakbutton = document.getElementById('break-button');
const breaktimer = document.getElementById('break-timer');

const tick = document.getElementById('tick');
const click = document.getElementById('click');
const beep = document.getElementById('beep');
const barwidth = 600; //600px in style.css

let time = 20; //should be set to pomodoro timer (1500s/ 1800s/ 2100s) == (25mins/ 30mins/ 35mins)
let counter = time; 
let state;

let abortClicked = false;

activebutton.addEventListener('click', ()=>{
    if (abortClicked) abortTimer();
    else {
        alert("Abort will end all pomo sessions, click again if you want to continue");
        abortClicked = true;
    }
});

breakbutton.addEventListener('click', ()=>{
    if (abortClicked) abortTimer();
    else {
        alert("Abort will end all pomo sessions, click again if you want to continue");
        abortClicked = true;
    }
});

function startTimer(page){
    let task = tasklist[0] ? tasklist[0][0] : false;
    page == "active" && task ? document.getElementById("first-task").textContent = "Task: " + task : task ? false : abortTimer();
    click.play();
    reset();
    updateCounter(page);
    state = setInterval(()=>{
        counter -= 1;
        counter == 0 ? redirectToPage(page) : (counter < 6 ? tick.play() : false);
        if (page == "active"){
            activebar.style.width = ((barwidth*counter)/time).toString() + "px";
            updateCounter("active");
        }
        else updateCounter("break");
    },1000);
}

function redirectToPage(curPage){
    clearInterval(state);
    beep.play();
    setTimeout(function(){ 
        if (curPage == "active"){
            document.getElementById("active-page").style.display = "none";
            document.getElementById("break-page").style.display = "inline";
            document.getElementById("to-break-page").click();
            startTimer("break");
        }
        else if (curPage == "break"){
            for (let i = 0; i < tasklist.length; i++){
                if (completed.includes(tasklist[i][0])){
                    let task = document.getElementById('break-task-container').children[i+1];
                    if (task) document.getElementById('break-task-container').children[i+1].remove();
                    tasklist.splice(i--, 1);
                }
            }
            document.getElementById("active-page").style.display = "inline";
            document.getElementById("break-page").style.display = "none";
            startTimer("active");
            document.getElementById("to-active-page").click();
        }
    }, 500);
}

function updateCounter(page){
    let mins = Math.floor(counter / 60);
    let secs = counter % 60;
    mins = mins < 10 ? "0" + parseInt(mins) : parseInt(mins);
    secs = secs < 10 ? "0" + parseInt(secs) : parseInt(secs);
    if (page == "active"){
        activetimer.innerHTML = mins + ":" + secs;
        document.title = mins + ":" + secs + " Timer Active";
    }
    else if (page == "break"){
        breaktimer.innerHTML= mins + ":" + secs;
        document.title = mins + ":" + secs + " Timer Break";
    }
}

function reset(){
    state = null;
    counter =  time;
    abortClicked = false;
    activebar.style.width = "600px";
}

function abortTimer(){
    clearInterval(state);
    beep.play();
    
    window.localStorage.setItem("completedlist", completed.toString()); //bryan you can change this since the result page needs the completedlist
    document.location.replace('../HTML/results-page.html');
}