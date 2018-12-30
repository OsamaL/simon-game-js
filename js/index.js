function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var numberOfTiles = window.prompt("Please enter the number of tiles you want to play with: ", 3);

var angleAtTip = 360.0 / numberOfTiles;

var array = ["darkred", "darkgreen"];

var parent = document.getElementById("center");
for(i = 0; i < numberOfTiles; i++){
  var tile = document.createElement("div");
  // tile.style.overflow = "hidden";
  tile.style.position = "absolute";
  tile.style.top = "50%";
  tile.style.left = "50%";
  tile.style.width = "100%";
  tile.style.height = "100%";
  tile.style.transformOrigin = "0% 0%";
  tile.style.id = "slice";
  tile.overflow = "hidden";
  tile.style.webkitTransform = "rotate(" + angleAtTip * i + "deg) " +  "skewY(" + (90 - angleAtTip) +"deg)";
  tile.style.background = getRandomColor();//array[i%2];
  parent.appendChild(tile);
}
