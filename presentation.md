# Adobe Scripting 101

___


# What’s the goal of this class?
Give you the knowledge needed to build your own Adobe scripts

___

# How are scripts different than actions?
*Actions* are **recorded steps**
*Scripts* can **make decisions** based on information.

___

# What can scripts do?

___

![autoplay loop](./presentation-assets/generative-example.mp4)

^ generate drawings

___

![autoplay loop](./presentation-assets/workflow-example.mp4)

^ automate workflows

___

![autoplay loop](./presentation-assets/features-example.mp4)

^ implement new features

___

# Code = ?

___

# Code = Instructions

___

```javascript
document = app.activeDocument;

for(var i=0; i<document.layers.length; i++) {
  document.layers[i].visible = false;
}

for(var i=0; i<document.layers.length; i++) {

  document.layers[i].visible = true;

  outputPath = document.path;
  outputPath.changePath(document.layers[i].name + '.png');

  exportRules = new ExportOptionsPNG24();
  exportRules.transparency = true;

  document.exportFile(outputPath, ExportType.PNG24, exportRules);
}
```
___

![fit](./presentation-assets/omgwtf.jpg)

___


# Rules to solve problems with code
1. Understand the problem
2. Break it down into simple parts
3. Code it

^ isolate what humans take for granted
^ be explicit!

___

# Let’s Try It!
<br>
## Export illustrator layers as a .png

___

# _**1:**_ Understand the Problem

^ open illustrator document and walk through how to do it

___

## Export illustrator layers as a .png
<br>
# ↓
<br>
## Save each layer within the current illustrator document as a transparent .png image

___

# _**2:**_ Break it down into simple parts

___

1. Select this document
2. Hide all the the layers
3. Set a layer to visible
4. Figure out where to save it
5. Save it
6. Repeat steps 3 through 5 until there are no more layers

___

# _**3:**_ Code It!

^ Open ExtendScript, open illustrator, make sure they are paired

___


```javascript
document = app.activeDocument;

for(var i=0; i<document.layers.length; i++) {
  document.layers[i].visible = false;
}

for(var i=0; i<document.layers.length; i++) {

  document.layers[i].visible = true;

  outputPath = document.path;
  outputPath.changePath(document.layers[i].name + '.png');

  exportRules = new ExportOptionsPNG24();
  exportRules.transparency = true;

  document.exportFile(outputPath, ExportType.PNG24, exportRules);
}
```

^ only 12 lines without spaces, YOU CAN DEW IT!
^ mention curly brackets
^ mention semicolons

___


```javascript
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
```

___

# What did we just learn?

___

# Variables
## A Storage Container

```javascript
outputPath = document.path;
outputPath.changePath(document.layers[i].name + '.png');
```

^ we can manipulate our storage container

___

# Looping
## A Way to iterate over items

```javascript
for(var i=0; i<document.layers.length; i++) {
	// do something here
}
```

^ what else might we iterate over? selected paths, swatches, files?

___

# Conditionals
## Do something, if something
```javascript
if(i>0){
	// do something
}
```

___

# Generative Drawing

___

![fit](./presentation-assets/generative-drawing.png)

^ draw the grid on the board
^ setup a new illustrator document 500px x 500px
^ draw a new square that’s 50px by 50px

___

```javascript
document = app.activeDocument;
original = app.activeDocument.selection[0];

for(var i=0; i<5; i++) {
  for(var j=0; j<5; j++) {
    var newItem      = original.duplicate();
    newItem.position = [100*i, 100*j];
  }
}
```

^ why are we using i AND j
^ what’s wrong here?

___

```javascript
document = app.activeDocument;
original = app.activeDocument.selection[0];

for(var i=0; i<5; i++) {
  for(var j=0; j<5; j++) {
    var newItem      = original.duplicate();
    newItem.position = [100*i, -1*100*j];
  }
}
```

^ let’s position it in the center

___

```javascript
document = app.activeDocument;
original = app.activeDocument.selection[0];

for(var i=0; i<5; i++) {
  for(var j=0; j<5; j++) {
    var newItem      = original.duplicate();
    newItem.position = [100*i, -1*100*j];
    newItem.translate(50/2, -1*50/2);
  }
}
```
___

```javascript
document = app.activeDocument;
original = app.activeDocument.selection[0];

for(var i=0; i<5; i++) {

  for(var j=0; j<5; j++) {
    var newItem      = original.duplicate();
    newItem.position = [100*i, -1*100*j];
    newItem.translate(50/2, -1*50/2);

    var randomAngle  = random(0, 360);
    newItem.rotate(randomAngle);
  }
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

```

^ how did you know how to get a random number between two numbers
^ it only works if the document is a single size and the shape is a known size, and our program knows ahead of time the number of columns and the number of rows

___

```javascript
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
```

^ there’s more to do here, but this will work for now

___

![](./presentation-assets/generative-drawing.png)

___


# What did we just learn?

___

# Functions
```javascript
function random(min, max){
	// do some stuff
}
```

___

# User Input
```javascript
numRows = prompt('How many rows?');
```
___

# How do I know what’s possible?

^ open the object model viewer
___


# Further Learning
* Adobe Scripting Documentation - http://www.adobe.com/devnet/scripting.html

* Illustrator Scripts - http://design.tutsplus.com/articles/20-free-and-useful-adobe-illustrator-scripts--vector-3849

* Collider Scribe - http://astutegraphics.com/software/colliderscribe/

___