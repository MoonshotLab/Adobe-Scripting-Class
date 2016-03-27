// kaleidoscope.jsx

// An Adobe Illustrator script which takes a path or group
// and radially distributes objects based on sets of options


var originalItem        = app.activeDocument.selection[0];
var input               = {
  referencePoint        : Transformation.CENTER,
  scaleFactor           : 1,
  radiusFactor          : 1,
  itemFactor            : 0,
  twistFactor           : 0,
  ringCount             : 5,
  itemCount             : 6,
  itemIncrement         : 0,
  itemVariance          : 0,
  distributionVariance  : 0,
  rotationVariance      : 0,
};



// do for each ring
for(var i = 0; i<input.ringCount; i++){

  var itemCount = input.itemCount;

  // increment items based on ring number
  if(input.itemIncrement)
    itemCount += input.itemIncrement*i;

  // add some randomness to the number of items
  if(input.itemVariance){
    var hi = itemCount + input.itemVariance;
    var lo = itemCount - input.itemVariance;
    itemCount = randomNumber(lo, hi);
  }

  // do for each item
  for(var j = 0; j<itemCount; j++){
    drawItem({
      itemCount   : itemCount,
      itemNumber  : j,
      ringNumber  : i
    });
  }
}


// {
//    ringNumber : the number of ring the item is drawn within
//    itemCount  : the total number of items drawn in this ring
//    itemNumber : the index of this item in the count
// }
function drawItem(opts){
  var newItem   = originalItem.duplicate();
  var angle     = 360 / opts.itemCount;
  var scale     = 100+(input.scaleFactor*(opts.ringNumber+1));

  // add rotational variance
  if(input.rotationVariance){
    var angleVariance = randomNumber(0, input.rotationVariance);
    if(randomNumber(1, 2) == 1) angle += angleVariance;
    else angle -= angleVariance;
  }
  angle = angle*(opts.itemNumber+1);

  // calculate radians and add twist effect
  var twist   = input.twistFactor/100*opts.ringNumber;
  var radians = (2*Math.PI/opts.itemCount)*opts.itemNumber+twist;

  // add positional variance
  if(input.distributionVariance){
    var distributionVariance = randomNumber(0, input.distributionVariance)/100;
    if(randomNumber(1, 2) == 1) radians += distributionVariance;
    else radians -= distributionVariance;
  }

  // calculate the x and y offset
  var itemWidth   = originalItem.width;
  var prevScale   = 100+(input.scaleFactor*(opts.ringNumber));
  var origScale   = 100+input.scaleFactor;
  var offset      = prevScale/100/2*itemWidth + origScale/100/2*itemWidth;
  var translation = offset*input.radiusFactor*(opts.ringNumber+1);
  var xPos        = Math.cos(radians)*translation;
  var yPos        = Math.sin(radians)*translation;

  // dew it!
  newItem.translate(xPos, yPos);
  newItem.resize(scale, scale, true, true, true, true, 0, Transformation.CENTER);
  newItem.zOrder(ZOrderMethod.SENDTOBACK);
  newItem.rotate(angle, true, true, true, true, input.referencePoint);
}



var randomNumber = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
