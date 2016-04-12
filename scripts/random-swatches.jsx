document  = app.activeDocument;
﻿selection = document.selection;
swatches  = document.swatches.getSelected();

for (var i=0; i<selection.length; i++){
  item = selection[i];
  item.filled = true;

  swatchIndex = Math.round(Math.random() * (swatches.length - 1));

  if(item.typename == 'PathItem')
    item.fillColor = swatches[swatchIndex].color;
  else
    item.pathItems[0].fillColor = swatches[swatchIndex].color;
}
