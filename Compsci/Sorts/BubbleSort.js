var values = [];
var TEXT_COLOR;
var DELAY;
var NUM_ELEMENTS;

var shuffle_swaps;
var time_since_last;

var current_index;
var end_point;

var started;
var finished;

var swaps;
var compares;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent("simulation")
  cnv.align("horizontal")

  colorMode(HSB);
  rectMode(CORNERS);
  
  // default color for text
  TEXT_COLOR = color(170,10,240);
  
  // time between decisions
  DELAY = 10;
  
  // size of array to be created
  NUM_ELEMENTS = 100;
  
  for (let i = 0; i < NUM_ELEMENTS;i++) {
    values[i] = new Value(i,i);
  }
  
  shuffle_swaps = 0;
  time_since_last = 0;
  swaps = 0;
  compares = 0;
  finished = false;
  started = false;
}

class Value {
  constructor(value,position) {
    this.value = value;
    this.position = position;
    this.isCompared = false;
    this.isSwapped = false;
    this.lastChanged = -1;
  }
  
  display() {
    if (this.isCompared | this.isSwapped) {
      if ((millis() - this.lastChanged) >= DELAY | finished) {
        this.isCompared = false;
        this.isSwapped = false;
        this.lastChanged = -1;
      }
    }
    
    let start_x = width * 0.05;
    let rect_width = (width*0.9)/NUM_ELEMENTS;
    
    stroke(0);
    strokeWeight(2);
    
    if (this.isSwapped) {
      fill(0,255,255);
    } else if (this.isCompared) {
      fill(150,255,255);
    } else {
      fill(255);
    }
    rect(start_x + rect_width*this.position,height*0.9,start_x + rect_width*(this.position+1),(height*0.1) + (height*0.7) * (NUM_ELEMENTS-this.value)/NUM_ELEMENTS );
  }
  
  swap(position) {
    swaps++;
    
    let other_value = values[position];
    values[this.position] = other_value;
    values[position] = this;
    
    other_value.position = this.position;
    this.position = position;
    
    this.isSwapped = true;
    this.lastChanged = millis();
    other_value.isSwapped = true;
    other_value.lastChanged = millis();
  }
  
  compare(position) {
    compares++;
    
    this.isCompared = true;
    this.lastChanged = millis();
    values[position].isCompared = true;
    values[position].lastChanged = millis();
    
    if (this.value > values[position].value) {
      return true;
    }
    return false;
  }
  
}


function displayValues() {
  for (let i = 0; i < NUM_ELEMENTS; i++) {
    values[i].display();
  }
}

function shuffleStep() {
  if ((millis() - time_since_last) > DELAY) {
    time_since_last = millis();
    shuffle_swaps++;
    
    posA = floor(random(NUM_ELEMENTS));
    posB = floor(random(NUM_ELEMENTS));
    
    values[posA].swap(posB);
  }
}

function sortStep() {
   if ((millis() - time_since_last) > DELAY) {
     time_since_last = millis();
     
     let current_value = values[current_index];
     let next_value = values[current_index+1];
     let should_swap = current_value.compare(current_index+1);
     
     if (should_swap) {
       current_value.swap(current_index+1);
     }
     
     current_index++; 
     if (current_index == NUM_ELEMENTS - end_point) {
       current_index = 0;
       end_point++;
       if (end_point == NUM_ELEMENTS - 1) {
         finished = true;
       }
     }
   }
}

function draw() {
  background(190,255,40);

  textAlign(CENTER);
  textSize(20);
  fill(255)
  
  if (started) {
    if (shuffle_swaps < 1000) {
      text("Shuffling...",width/2,20);
      DELAY = 1;
      shuffleStep();

    } else if (finished) {
      text("Finished! Will Start Again Soon.",width/2,20);

      DELAY = 10000;
      if (millis() - time_since_last > DELAY) {
        finished = false;
        shuffle_swaps = 0;
        compares = 0;
        swaps = 0;
      }

    } else {
      text("Sorting...",width/2,20);

      if (shuffle_swaps == 1000) {
        swaps = 0;
        current_index = 0;
        end_point = 1;
        shuffle_swaps++
        DELAY = 1;
      }

      sortStep();
    }
  } else {
    text("Press Enter to Begin",width/2,20);
  }
  
  textAlign(LEFT);
  text("Comparisons: " + compares,0,20);
  text("Swaps: " + swaps,0,40);
  displayValues();
}

function keyPressed() {
  if (keyCode == ENTER) {
    started = true;
  }
}