var text_color;
var game_state;

var left_select = -1;
var right_select = -1;

var runes = [];
var names = ["POW","CEN","FIG","JON","LOP","COR","RAG","FIN","GA.",".^.","SHU","FEI","404","ERR","BIT","314","SHA","CLA","THU","FOR","WHI","LET","RUE","FAL","SEE"]

var made_comparison;
var comparisons;
var swaps;

var end_time;
var score;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent('game');
  cnv.center('horizontal');
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
    if (game_state == 1 & this.checkMouseCollision()) {
      fill(240);
    } else {
      fill(this.color);
    }
  
    strokeWeight(3);
    
    if (this.position == left_select & game_state == 1) {
      stroke(color(150,255,255));
    } else if (this.position == right_select & game_state == 1) {
      stroke(color(0,255,255)); 
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
    let first_position = this.position;
    let second_position = other.getPosition();
    
    this.position = second_position;
    other.setPosition(first_position);
    
    runes[first_position] = runes[second_position];
    runes[second_position] = this;
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
  text("PRESS SPACE TO BEGIN",0.5 * width, 0.9 * height );
}


function game_setup() {
  let tempNames = []
  for (let i = 0; i < names.length; i++) {
    tempNames[i] = names[i];
  }
  
  for (let i = 0; i < 10; i++) {
    let rand_num = floor(random(tempNames.length));
    let temp_name = tempNames[rand_num];
    tempNames.splice(rand_num,1);
    runes[i] = new Rune(i,i,temp_name,color(random(255),255,random(255)));
  }
  
  for (let i = 0; i < 100; i++) {
    let posA = floor(random(0,10));
    let posB = floor(random(0,10));
    runes[posA].swap(runes[posB]);
  }
  
  swaps = 0;
  comparisons = 0;
  left_select = -1;
  right_select = -1;
  made_comparison = false;
}

function game_loop() {
  for (let i = 0; i < 10; i++) {
    runes[i].display();
  }
  
  
  fill(text_color)
  noStroke()
  textSize(20)
  text("Swap is 'S', ENTER when finished",0.5*width,30);
  
  textAlign(LEFT)
  text("Comparisons: " + comparisons,0,30);
  text("Swaps: " + swaps,0,60);
  textAlign(CENTER)

  if (left_select == -1 | right_select == -1) {
    text("click on a rune to select/deselect, shift-click to make a second selection",0.5*width,height - 30)
  } else {
    
    if (!made_comparison) {
       text("Wish to compare? Press C",0.5*width,height - 30)
    }else if (runes[left_select].compare(runes[right_select])) {
      fill(color(150,255,255))
      text("The winner is " + runes[left_select].getName(),0.5*width,height - 30)
    } else {
      fill(color(0,255,255))
      text("The winner is " + runes[right_select].getName(),0.5*width,height - 30)
    }
    
  }
  
}

function end_loop() {
  let time_dif = millis() - end_time;
  
  fill(text_color)
  noStroke()
  textSize(20)
  textAlign(LEFT)
  text("Comparisons: " + comparisons,0,30);
  text("Swaps: " + swaps,0,60);
  textAlign(CENTER)
  
  strokeWeight(2);
  stroke(0)
  
  for (let i = 0; i < 10; i++) {
    if (runes[i].getWeight() == i) {
      fill(150,255,255)
    } else {
      fill(0,255,255)
    }

    if (time_dif < 1000) {
      let offset = sin( HALF_PI * time_dif/1000 ) * 35;
      text(""+(runes[i].getWeight() + 1),(width/10)*(i+0.5),height/2 + 5 - offset);
    } else {
      text(""+(runes[i].getWeight() + 1),(width/10)*(i+0.5),height/2 - 30)
    }
  } 
  
  if (time_dif >= 1000) {
    fill(text_color)
    noStroke()
    
    if (score == 10) {
      text("You won! If you think you could do better, press ENTER" ,0.5*width,height - 100)
    } else {
      text("Hmm... You only got " + score + " runes correct. If you'd like to try again, press ENTER",0.5*width,height - 100)
    }
  }
  
  for (let i = 0; i < 10; i++) {
    runes[i].display();
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
        swaps++;
        
        let temp_select = left_select;
        left_select = right_select;
        right_select = temp_select;
      }
    }
    
    if (keyCode == 67) {
      if (!made_comparison & !(left_select == -1 | right_select == -1)) {
        made_comparison = true;
        comparisons++;
      }
    }
    
    if (keyCode == ENTER) {
      game_state = 2;
      end_time = millis();
      
      score = 0;
      for (i = 0; i < 10; i++) {
        if (runes[i].getWeight() == i) {
          score++;
        }
      }
    }
    
  } else if(game_state == 2) {
    if (keyCode == ENTER) {
      game_state = 0;
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
    }
    
    made_comparison = false;
    
    if (keyIsDown(SHIFT)) {
      if (selected == left_select) {
        right_select = selected;
        left_select = -1;
      } else if (selected == right_select) {
        right_select = -1;
      } else {
        right_select = selected;
      }
    } else {
      if (selected == right_select) {
        left_select = selected;
        right_select = -1;
      } else if (selected == left_select) {
        left_select = -1;
      } else {
        left_select = selected;
      }
    }
  } 
}

function draw() {
  background(190,255,40);
  
  if (game_state == 0) {
    load_main_menu();
  } else if (game_state == 1) {
    game_loop();
  } else if (game_state == 2) {
    end_loop();
  }
  
}