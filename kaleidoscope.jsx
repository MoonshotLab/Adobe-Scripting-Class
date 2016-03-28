// kaleidoscope.jsx

// An Adobe Illustrator script which takes a path or group
// and radially distributes objects based on sets of options

var hasRun              = false;
var originalItem        = app.activeDocument.selection[0];
var options             = {
  referencePoint        : 'Center',
  scaleFactor           : 1,
  radiusFactor          : 1,
  twistFactor           : 0,
  ringCount             : 5,
  itemCount             : 6,
  itemIncrement         : 0,
  itemVariance          : 0,
  distributionVariance  : 0,
  rotationVariance      : 0
};


// use a human naming convention when listing reference
// points in the UI
var referencePoints = [
  { name : 'Center',        value : Transformation.CENTER       },
  { name : 'Left',          value : Transformation.LEFT         },
  { name : 'Right',         value : Transformation.RIGHT        },
  { name : 'Top',           value : Transformation.TOP          },
  { name : 'Top Left',      value : Transformation.TOPLEFT      },
  { name : 'To Right',      value : Transformation.TOPRIGHT     },
  { name : 'Bottom',        value : Transformation.BOTTOM       },
  { name : 'Bottom Left',   value : Transformation.BOTTOMLEFT   },
  { name : 'Bottom Right',  value : Transformation.BOTTOMRIGHT  }
];

var lookUpReferencePointByName = function(str){
  for(var i=0; i<referencePoints.length; i++){
    if(referencePoints[i].name == str){
      return referencePoints[i].value;
    }
  }
};




// build the user interface
(function buildUi(){
  var dialog = new Window('dialog', 'kaleidoscope');

  // create ui groups for the ui elements
  var groups = {
    referencePoint  : dialog.add('group', [0, 0, 300, 20], 'Reference Point:'),
    d1              : dialog.add('panel', [0, 0, 300, 0], ''),
    factor          : dialog.add('group', [0, 0, 300, 90], 'Factors:'),
    d2              : dialog.add('panel', [0, 0, 300, 0], ''),
    count           : dialog.add('group', [0, 0, 300, 70], 'Counts:'),
    d3              : dialog.add('panel', [0, 0, 300, 0], ''),
    variance        : dialog.add('group', [0, 0, 300, 90], 'Variance:'),
    d4              : dialog.add('panel', [0, 0, 300, 0], ''),
    buttons         : dialog.add('group', undefined, '')
  };

  // create a list of strings to populate the dropdown list
  var referencePointStrings = [];
  for(var key in referencePoints){
    referencePointStrings.push(referencePoints[key].name);
  }

  // add input labels
  groups.referencePoint.add('statictext', [0, 2, 120, 20],  'Reference Point:');
  groups.factor.add('statictext',         [0, 10, 133, 20], 'Scale Factor:');
  groups.factor.add('statictext',         [0, 37, 133, 20], 'Radius Factor:');
  groups.factor.add('statictext',         [0, 64, 133, 20], 'Twist Factor:');
  groups.count.add('statictext',          [0, 0, 133, 20],  'Ring Count:');
  groups.count.add('statictext',          [0, 27, 133, 20], 'Item Count:');
  groups.count.add('statictext',          [0, 52, 133, 20], 'Increment Count:');
  groups.variance.add('statictext',       [0, 10, 133, 20], 'Item Variance:');
  groups.variance.add('statictext',       [0, 37, 133, 20], 'Distribution Variance:');
  groups.variance.add('statictext',       [0, 64, 133, 20], 'Rotational Variance:');

  var inputs = [
    {
      el : groups.referencePoint.add('dropdownlist', [123, 0, 280, 20], referencePointStrings),
      optionName : 'referencePoint'
    },
    {
      el : groups.factor.add('slider', [123, 0, 285, 25], options.scaleFactor, 1, 100),
      optionName : 'scaleFactor'
    },
    {
      el : groups.factor.add('slider', [123, 41, 285, 25], options.radiusFactor, -1, 5),
      optionName : 'radiusFactor'
    },
    {
      el : groups.factor.add('slider', [123, 67, 285, 25], options.twistFactor, 0, 75),
      optionName : 'twistFactor'
    },
    {
      el : groups.count.add('edittext', [125, 0, 150, 20], options.ringCount),
      optionName : 'ringCount'
    },
    {
      el : groups.count.add('edittext', [125, 25, 150, 45], options.itemCount),
      optionName : 'itemCount'
    },
    {
      el : groups.count.add('edittext', [125, 50, 150, 70], options.itemIncrement),
      optionName : 'itemIncrement'
    },
    {
      el : groups.variance.add('slider', [123, 0, 285, 25], options.itemVariance, 0, 5),
      optionName : 'itemVariance'
    },
    {
      el : groups.variance.add('slider', [123, 41, 285, 25], options.distributionVariance, 0, 25),
      optionName : 'distributionVariance'
    },
    {
      el : groups.variance.add('slider', [123, 67, 285, 25], options.rotationVariance, 0, 90),
      optionName : 'rotationVariance'
    },
    {
      el : groups.buttons.add('button', undefined, 'Done', { name : 'ok' }),
      ignoreEvent : 'click'
    }
  ];

  // set the defaults
  inputs[0].el.selection = 0;

  // add identifiers to the ui elements and attach events
  for(var i=0; i<inputs.length; i++){
    inputs[i].el.optionName = inputs[i].optionName;

    if(!inputs[i].ignoreEvent)
      inputs[i].el.onChange = handleEvent;
  }

  function handleEvent(){
    // try and figure out the value of the input
    var val = this.value;
    if(!val) val = this.selection;
    if(!val) val = Number(this.text);
    options[this.optionName] = val;

    dialog.enabled = false;

    // undo the last transformation
    if(!hasRun) hasRun = true;
    else { app.undo(); }

    // transform and paint the UI
    applyTransformation();
    redraw();
    dialog.enabled = true;
  }

  dialog.show();
})();




function applyTransformation(){
  // do for each ring
  for(var i = 0; i<options.ringCount; i++){

    var itemCount = options.itemCount;

    // increment items based on ring number
    if(options.itemIncrement)
      itemCount += options.itemIncrement*i;

    // add some randomness to the number of items
    if(options.itemVariance){
      var hi = itemCount + options.itemVariance;
      var lo = itemCount - options.itemVariance;
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
}


// {
//    ringNumber : the number of ring the item is drawn within
//    itemCount  : the total number of items drawn in this ring
//    itemNumber : the index of this item in the count
// }
function drawItem(opts){
  var newItem   = originalItem.duplicate();
  var angle     = 360 / opts.itemCount;
  var scale     = 100+(options.scaleFactor*(opts.ringNumber+1));

  // add rotational variance
  if(options.rotationVariance){
    var angleVariance = randomNumber(0, options.rotationVariance);
    if(randomNumber(1, 2) == 1) angle += angleVariance;
    else angle -= angleVariance;
  }
  angle = angle*(opts.itemNumber+1);

  // calculate radians and add twist effect
  var twist = 0;
  if(options.twistFactor) twist = options.twistFactor/100*opts.ringNumber;
  var radians = (2*Math.PI/opts.itemCount)*opts.itemNumber+twist;

  // add positional variance
  if(options.distributionVariance){
    var distributionVariance = randomNumber(0, options.distributionVariance)/100;
    if(randomNumber(1, 2) == 1) radians += distributionVariance;
    else radians -= distributionVariance;
  }

  // calculate the x and y offset
  var itemWidth   = originalItem.width;
  var prevScale   = 100+(options.scaleFactor*(opts.ringNumber));
  var origScale   = 100+options.scaleFactor;
  var offset      = prevScale/100/2*itemWidth + origScale/100/2*itemWidth;
  var translation = offset*options.radiusFactor*(opts.ringNumber+1);
  var xPos        = Math.cos(radians)*translation;
  var yPos        = Math.sin(radians)*translation;

  // dew it!
  newItem.translate(xPos, yPos);
  newItem.resize(scale, scale, true, true, true, true, 0, Transformation.CENTER);
  newItem.zOrder(ZOrderMethod.SENDTOBACK);
  newItem.rotate(angle, true, true, true, true, lookUpReferencePointByName(options.referencePoint));
}



function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
