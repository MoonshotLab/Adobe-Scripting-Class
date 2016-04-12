document    = app.activeDocument;
original    = app.activeDocument.selection[0];

numColumns  = prompt('How many columns?');
numRows     = prompt('How many rows?');

containerW  = document.width/numColumns;
containerH  = document.height/numRows;

for(var i=0; i<numColumns; i++){
  for(var j=0; j<numRows; j++){
    var newItem      = original.duplicate();
    newItem.position = [containerW*i, -1*containerH*j];
    newItem.translate(50/2, -1*50/2);

    var randomAngle  = random(0, 360);
    newItem.rotate(randomAngle);
  }
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
