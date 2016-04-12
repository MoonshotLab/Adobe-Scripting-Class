document = app.activeDocument;

for(var i=0; i<document.layers.length; i++) {
  document.layers[i].visible = false;
}

for(var i=0; i<document.layers.length; i++) {

  document.layers[i].visible = true;

  if(i>0){
    document.layers[i-1].visible = false;
  }

  outputPath = document.path;
  outputPath.changePath(document.layers[i].name + '.png');

  exportRules = new ExportOptionsPNG24();
  exportRules.transparency = true;

  document.exportFile(outputPath, ExportType.PNG24, exportRules);
}
