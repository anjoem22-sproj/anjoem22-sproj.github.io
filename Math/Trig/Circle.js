var angle;
var xList;
var yList;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent('circle');
  cnv.center('horizontal');

  colorMode(HSB);
  
  angle = 0;
  xList = [100];
  yList = [0];
}

function draw() {
  background(190,255,40);
  
  angle += 0.02;
  if (angle >= TWO_PI) {
    angle = 0;
  }
  
  push();
  translate(width/4,height/2);
  
  fill(255);
  stroke(0);
  strokeWeight(2);
  circle(0,0,200);
  
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(0,0,15);
  
  let x = 100*cos(angle);
  let y = -100*sin(angle)
  
  circle(x,0,15);
  circle(x,y,15);
  
  stroke(0,100,100);
  strokeWeight(7);
  line(x,0,x,y);
  
  stroke(90,100,100);
  line(0,0,x,0);
  
  stroke(90,100,100);
  line(0,0,x,0);
  
  stroke(0);
  line(0,0,x,y);
  
  pop();
  
  push();
  translate(width/2,height/2);
  
  stroke(0);
  strokeWeight(1);
  
  fill(90,100,100);
  circle(0,100*cos(angle),15)
  
  fill(0,100,100);
  circle(0,-100*sin(angle),15)

  xList.push(x);
  if (xList.length > width/2) {
    xList.splice(0,1);
  }
  
  yList.push(y);
  if (yList.length > width/2) {
    yList.splice(0,1);
  }
  
  strokeWeight(5);
  stroke(90,100,100)
  for (let i = xList.length; i >= 1; i--) {
    let j = xList.length - i;
    line(j,xList[i],j+1,xList[i-1]);
  }
  
  stroke(00,100,100)
  for (let i = yList.length; i >= 1; i--) {
    let j = yList.length - i;
    line(j,yList[i],j+1,yList[i-1]);
  }
  
  pop();
  
  textAlign(LEFT);
  textSize(30);
  fill(255);
  stroke(0);
  strokeWeight(2);
  text("Angle: " + round(angle,1) + " radians or " + round(degrees(angle),1) + " degrees",10,height-10);
}