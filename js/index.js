function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function shade(color, percent){
    if (color.length > 7 ) return shadeRGBColor(color,percent);
    else return shadeColor2(color,percent);
}

var numberOfTiles = window.prompt("Please enter the number of tiles you want to play with: ", 3);

var angleAtTip = 360.0 / numberOfTiles;

var array = ["darkred", "darkgreen"];

var parent = document.getElementById("center");
for(i = 0; i < numberOfTiles; i++){
  let tile = document.createElement("div");
  tile.style.position = "absolute";
  tile.style.top = "50%";
  tile.style.left = "50%";
  tile.style.width = "200%";
  tile.style.height = "200%";
  tile.style.transformOrigin = "0% 0%";
  tile.className = "slice";
  tile.overflow = "hidden";
  tile.style.webkitTransform = "rotate(" + angleAtTip * i + "deg) " +  "skewY(" + (90 - angleAtTip) +"deg)";
  tile.style.background = getRandomColor();
  tile.style.color= tile.style.background;
  tile.sliceNumber = i+1;
  parent.appendChild(tile);
}

let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win;

const turnCounter = document.querySelector("#turn");
const slices = [...document.querySelectorAll(".slice")];
const originalColor = slices.map(item => item.style.color);
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

strictButton.addEventListener("change", (event) => {
  if(strictButton.checked == true){
    strict = true;
  }
  else{
    strict = false;
  }
});

onButton.addEventListener("click", (event) => {
  if(onButton.checked == true){
    on = true;
    turnCounter.innerHTML = "-";
  }
  else{
    on = false;
    turnCounter.innerHTML = "";
    clearColor();
    clearInterval(intervalId);
    window.location.reload(false);
  }
});

startButton.addEventListener('click', (event) => {
  if (on || win) {
    play();
  }
});

function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  for (var i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * numberOfTiles) + 1);
  }
  compTurn = true;

  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      lighten(slices[order[flash]-1]);
      flash++;
    }, 200);
  }
}

slices.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (on) {
      playerOrder.push(item.sliceNumber);
      check();
      lighten(item);
      if(!win) {
        setTimeout(() => {
          clearColor();
        }, 300);
      }
    }
  });
});


function lighten(element){
    if (noise) {
    let audio = document.getElementById("clip"+(element.sliceNumber% 4 +1));
    audio.play();
  }
  element.style.background = shade(element.style.background, 0.30);
}

function clearColor() {
  for(var i = 0; i < numberOfTiles; i++){
    slices[i].style.background = originalColor[i];
  }
}

function flashColor() {
  for(var i = 0; i < numberOfTiles; i++){
    slices[i].style.background = shade(slices[i].style.background, 0.30);
  }
}


function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false;

  if (playerOrder.length == 20 && good) {
    winGame();
  }

  if (good == false) {
    flashColor();
    turnCounter.innerHTML = "NO!";
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();

      if (strict) {
        play();
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);

    noise = false;
  }

  if (turn == playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalId = setInterval(gameTurn, 800);
  }

}

function winGame() {
  flashColor();
  turnCounter.innerHTML = "WIN!";
  on = false;
  win = true;
}
