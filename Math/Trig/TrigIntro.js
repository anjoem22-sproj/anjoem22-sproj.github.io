var angle;
var mDist;

var guiTime;
var fadeTime;
var upTime;

var selectedProjectile;
var projectileTypes;
var projectiles;

var clickTime;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent('game');
  cnv.center('horizontal');

  colorMode(HSB);
  
  angle = 0;
  mDist = 100;
  
  guiTime = 0;
  upTime = 2000;
  fadeTime = 1000;
  
  clickTime = 0;
  
  selectedProjectile = 0;
  projectileTypes = ["Default","Gravity","Resisted","Wavy","Orbit"];
  projectiles = [];
}

class Projectile {
  constructor() {
    this.x = 0;
    this.y = 0;
    
    this.d = mDist;
    this.dp = 0;
    
    this.anglep = angle;
    this.angle = angle;
    
    this.vX = (mDist/30) * cos(angle);
    this.vY = (mDist/30) * sin(angle);
    
    this.type = selectedProjectile;
    
    this.time_created = millis();
    
    this.dead = false;
    
    this.liveTime = 10000;
    this.fadeTime = 2000;
  }
  
  step() {
    if (this.type == 1) {
      this.vY += 0.25;
    } else if (this.type == 2) {
      this.vY /= 1.02;
      this.vX /= 1.02;
    } else if (this.type == 3) {
      this.dp += this.d/30;
      this.anglep = this.angle + 0.1*sin((millis()-this.time_created)/100);
    } else if (this.type == 4) {
      this.angle += 0.04;
    }
    
    if (this.type < 3) {
      this.x += this.vX;
      this.y += this.vY;
    } else if (this.type == 3) {
      this.x = this.dp*cos(this.anglep);
      this.y = this.dp*sin(this.anglep);
    } else if (this.type == 4) {
      this.x = this.d * cos(this.angle);
      this.y = this.d * sin(this.angle)
    }
    
    if (this.x > width/2 | this.x < -width/2 | this.y > height/2 | this.y < -height/2) {
      this.dead = true;
    }
  }
  
  display() {
    if ((millis() - this.time_created) > this.liveTime) {
      let transparency = (this.fadeTime - ((millis() - (this.time_created + this.liveTime))))/this.fadeTime;
      
      fill(72*this.type,100,100,transparency);
      stroke(0,0,0,transparency);
      
      if (transparency >= 1) {
        this.dead = true;
      }
    } else {
      fill(72*this.type,100,100);
      stroke(0);
    }
    
    strokeWeight(2);
    circle(this.x,this.y,10);
  }
}

function draw() {  
  background(190,255,40);
  
  let cX,cY,relX,relY;
  
  cX = (width/2);
  cY = (height/2);
  
  relX = mouseX - cX;
  relY = mouseY - cY;
  
  angle = atan2(relY,relX);
  mDist = dist(cX,cY,mouseX,mouseY);
  if (mDist > 150) {
    mDist = 150;
  } else if (dist < 10) {
    mDist = 10;
  }
  
  if (mouseIsPressed & (millis() - clickTime) > 100) {
    clickTime = millis();
    let nP = new Projectile();
    projectiles.push(nP);
  }
  
  push();
  translate(cX,cY);
  
  fill(255)
  stroke(0);
  strokeWeight(2);
  circle(0,0,15);

  
  strokeWeight(8);
  stroke(0);
  line(0,0,mDist*cos(angle),mDist*sin(angle));
  
  stroke(0 + (150-mDist)*0.55,255,255);
  strokeWeight(5);
  rectMode(CENTER);
  line(0,0,mDist*cos(angle),mDist*sin(angle));
  
  for (let i = 0; i < projectiles.length; i++) {
    if (projectiles[i].dead) {
      projectiles.splice(i,1);
      i--;
      continue;
    }
    projectiles[i].step();
    projectiles[i].display();
  }
  
  pop();
  
  textAlign(CENTER);
  strokeWeight(3);
  textSize(40);
  
  let elapsed_time = millis() - guiTime 
  
  if (elapsed_time < upTime) {
    fill(255);
    stroke(0);
    
    text(projectileTypes[selectedProjectile],width/2,height-40);

  } else if (elapsed_time < upTime + fadeTime) {
    let transparency = ((upTime+fadeTime)-elapsed_time)/fadeTime
    
    text(projectileTypes[selectedProjectile],width/2,height-40);
    fill(0,0,100,transparency);
    stroke(0,0,0,transparency)
    
  } 
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    guiTime = millis();
    selectedProjectile = selectedProjectile - 1;
    if (selectedProjectile < 0) {
      selectedProjectile = projectileTypes.length-1;
    }
  } else if (keyCode == RIGHT_ARROW) {
    guiTime = millis();
    selectedProjectile = (selectedProjectile + 1) % projectileTypes.length
  }
}