// kaleidoscope.jsx

// An Adobe Illustrator script which takes a path or group
// and radially distributes objects based on sets of options


var originalItem        = app.activeDocument.selection[0];
var input               = {
  referencePoint        : Transformation.CENTER,
  scaleFactor           : 20,
  radiusFactor          : 1,
  itemFactor            : 0,
  ringCount             : 5,
  itemCount             : 8,
  itemIncrement         : 1,
  itemVariance          : 0,
  distributionVariance  : 0,
  rotationVariance      : 0,
};



// do for each ring
for(var i = 0; i<input.ringCount; i++){

  // do for each item
  var itemCount = input.itemCount;

  // increment items
  if(input.itemIncrement){
    itemCount += input.itemIncrement*i;
  }

  // use a random(ish) number of items
  if(input.itemVariance){
    var hi = itemCount + input.itemVariance;
    var lo = itemCount - input.itemVariance;
    itemCount = randomNumber(lo, hi);
  }

  for(var j = 0; j<itemCount; j++){
    drawItem({
      itemCount   : itemCount,
      itemNumber  : j,
      ringNumber  : i
    });
  }
}


// {
//    ringNumber :
//    itemCount  :
//    itemNumber :
// }
function drawItem(opts){
  var newItem   = originalItem.duplicate();
  var angle     = 360 / opts.itemCount;
  var scale     = 100+(input.scaleFactor*(opts.ringNumber+1));

  // conditionally add angular distribution variance
  if(input.rotationVariance){
    var angleVariance = randomNumber(0, input.rotationVariance);

    if(randomNumber(1, 2) == 1) angle += angleVariance;
    else angle -= angleVariance;
  }
  angle = angle*(opts.itemNumber+1);

  // translate if necessary
  var translate = { x : 0, y : 0};
  if(input.radiusFactor){
    var lastScale   = 100+(input.scaleFactor*(opts.ringNumber));
    var origScale   = (100+input.scaleFactor)/100/2*originalItem.width;
    var offset      = lastScale/100/2*originalItem.width + origScale;
    var translation = offset*input.radiusFactor*(opts.ringNumber+1);
    var radians     = (2*Math.PI/opts.itemCount)*opts.itemNumber;

    if(input.distributionVariance){
      var distributionVariance = randomNumber(0, input.distributionVariance)/100;
      if(randomNumber(1, 2) == 1) radians += distributionVariance;
      else radians -= distributionVariance;
    }

    translate.x     = Math.cos(radians)*translation;
    translate.y     = Math.sin(radians)*translation;
  }

  // dew it!
  newItem.translate(translate.x, translate.y);
  newItem.resize(scale, scale, true, false, false, false, true, Transformation.CENTER);
  newItem.zOrder(ZOrderMethod.SENDTOBACK);
  newItem.rotate(angle, true, false, false, false, input.referencePoint);
}



var randomNumber = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
