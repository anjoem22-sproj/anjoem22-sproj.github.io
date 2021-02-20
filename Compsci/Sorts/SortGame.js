var text_color;
var game_state;

var left_select = -1;
var right_select = -1;

var runes = [];
var names = ["POW","CEN","FIG","JON","LOP","COR","RAG","FIN","GA.",".^.","SHU","FEI","404","ERR","BIT","314","SHA","CLA","THU","FOR","WHI","LET","RUE","FAL","SEE"]

function setup() {
  createCanvas(800, 400);
  colorMode(HSB)
  
  text_color = color(170,10,240)
  game_state = 0;
}

class Rune {
  constructor(weight, position, name, color) {
    this.weight = weight;
    this.position = position;
    this.name = name;
    this.color = color;
  }
  
  getWeight() {
    return this.weight;
  }
  
  getName() {
    return this.name;
  }
  
  getPosition() {
    return this.position;
  }
  
  setPosition(position) {
    this.position = position;
  }
  
  checkMouseCollision() {
    let centerX = (width/10)*(this.position+0.5)
    
    let leftBound = centerX - (width/40);
    let rightBound = centerX + (width/40);
    let topBound = (height/2) + (width/40);
    let bottomBound = (height/2) - (width/40);
    
    if (mouseX > leftBound & mouseX < rightBound & mouseY < topBound & mouseY > bottomBound) {
      return true;
    }
    
    return false;
  }
  
  display() {
    if (this.checkMouseCollision()) {
      fill(240);
    } else {
      fill(this.color);
    }
  
    strokeWeight(3);
    
    if (this.position == left_select) {
      stroke(color(0,255,255));
    } else if (this.position == right_select) {
      stroke(color(150,255,255)); 
    } else {
      stroke(0)
    }
    
    circle((width/10)*(this.position+0.5),height/2,(width)/20);
    textAlign(CENTER);
    
    fill(0,0,255);
    strokeWeight(2);
    stroke(0);
    textSize(15);
    text(this.name,(width/10)*(this.position+0.5),height/2 + 5);
  }
  
  compare(other) {
    if (this.weight > other.getWeight()) {
      return true;
    } else {
      return false;
    }
  }
  
  swap(other) {
    let temp_position = this.position;
    this.position = other.getPosition();
    other.setPosition(temp_position);
  }
}

function load_main_menu() {
  fill(text_color);
  textAlign(CENTER);
  textSize(40);
  text("The Blind Runes",width/2,50);
  
  fill(0);
  rect(0.125 * width,70,0.75 * width, 0.5 * height);
  
  fill(text_color);
  textAlign(LEFT);
  textSize(20);
  text("You are equipped with 10 powerful runes. You are tasked to order the runes in terms of power. Interacting with more than two runes at one time could destroy the whole world! In order to sort the runes, you are permitted to evaluate two runes against eachother and swap their positions. Have fun!", 0.2 * width,90,0.61 * width, 0.5 * height);
  
  textAlign(CENTER);
  text("PRESS SPACE TO BEGIN",0.5 * width, 0.9 * height);
}


function game_setup() {
  for (let i = 0; i < 10; i++) {
    runes[i] = new Rune(i,i,i+1,color(random(255),255,random(255)));
  }
  
  for (let i = 0; i < 100; i++) {
    let posA = floor(random(0,10));
    let posB = floor(random(0,10));
    runes[posA].swap(runes[posB]);
    
    let temp_rune = runes[posA];
    runes[posA] = runes[posB];
    runes[posB] = temp_rune;
  }
}

function game_loop() {
  for (let i = 0; i < 10; i++) {
    runes[i].display();
  }
  
  fill(text_color)
  noStroke()
  textSize(20)
  text("click to select/deselect, press s to swap, press spacebar to deselect all",0.5*width,30);

  if (left_select == -1 | right_select == -1) {
    text("There is no winner",0.5*width,height - 30)
  } else {
    if (runes[left_select].compare(runes[right_select])) {
      fill(color(0,255,255))
      text("The winner is " + runes[left_select].getName(),0.5*width,height - 30)
    } else {
      fill(color(150,255,255))
      text("The winner is " + runes[right_select].getName(),0.5*width,height - 30)
    }
  }
  
}

function keyPressed() {
  if (game_state == 0) {
    
    if (keyCode == 32) {
      game_setup();
      game_state = 1;
    }
    
  } else if(game_state == 1) {
    
    if (keyCode == 32) {
      left_select = -1;
      right_select = -1;
    }
    
    if (keyCode == 83) {
      if (!(left_select == -1 | right_select == -1)) {
        runes[left_select].swap(runes[right_select]);
    
        let temp_rune = runes[left_select];
        runes[left_select] = runes[right_select];
        runes[right_select] = temp_rune;
      }
    }
  }
}

function mousePressed() {
  if (game_state == 1) {
    let selected = -1;
    for (let i = 0;i < 10;i++) {
      if (runes[i].checkMouseCollision()) {
        selected = i;
      }
    }
    if (selected == -1) {
      return;
    } else if (selected == left_select) {
      left_select = -1;
    } else if (selected == right_select) {
      right_select = -1;
    } else if (left_select == -1) {
      left_select = selected;
    } else {
      right_select = selected;
    }
  } 
}

function draw() {
  background(190,255,40);
  
  if (game_state == 0) {
    load_main_menu();
  } else if (game_state == 1) {
    game_loop();
  }
  
}