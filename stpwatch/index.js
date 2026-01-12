const display = document.getElementById('display');
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function start(){
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateDisplay, 100);
}
function stop(){
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timer);

}
function reset(){
    isRunning = false;
    clearInterval(timer);
    elapsedTime = 0;
    display.textContent = "00:00:00:00";

}
function updateDisplay(){
    const now = Date.now();
    elapsedTime = now - startTime;
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)));
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);
    display.textContent = 
        `${String(hours).padStart(2, '0')}:
         ${String(minutes).padStart(2, '0')}:
         ${String(seconds).padStart(2, '0')}:
         ${String(milliseconds).padStart(2, '0')}`;
    
}