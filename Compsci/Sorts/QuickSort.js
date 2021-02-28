var t0;
var game_state;

var values;

var selected;
var completed;

var segments;

var num_values;
var text_color;

var started;

var fill_index;
var action;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent("quicksort");
  cnv.center("horizontal");

  colorMode(HSB);
  text_color = color(170,10,240);
  
  // gamestates: 
  // 0 = Pre-start - Does nothing until user begins
  // 1 = Fill Stage - fills array with random numbers
  // 2 = Sorting Stage - sorts the values
  game_state = 0;
  t0 = 0;
  
  num_values = 10;
  
  values = [];
  segments = [];
  
  selected = -1;
  completed = [];
  
  started = false;
  
  fill_index = 0;
  action = 0;
  
  for (let i = 0; i < num_values; i++) {
    values[i] = new Box(-1,i);
  }
}

class Box {
  constructor(value,index) {
    let screen_fraction = (0.8*width);
    this.size = screen_fraction/(num_values);
    
    this.value = value;
    this.index = index; 
  
    this.y = height/2;
    this.move();
  }
  
  display() {
    rectMode(CENTER);
    
    if (this == selected) {
      stroke(0,255,255);
    } else if (completed.includes(this)) {
      stroke(100,255,255);
    } else {
      stroke(255);  
    }
    
    strokeWeight(2);
    if (this.value == -1) {
      fill(0);
    } else {
      fill(100 - ((this.value+1)*0.1),75,50);
    }
    square(this.x,this.y,this.size);
    
    if (this.value != -1) {
      fill(text_color);
      stroke(0);
      strokeWeight(5);
      textSize(30);
      textAlign(CENTER);
      text(""+this.value,this.x,this.y+10);
    }
  }
  
  move() {
    let screen_fraction = (0.8*width);
    this.x = (this.size+2) * (this.index+0.5) + (width-screen_fraction)/2 - num_values;
  }
}

function draw() {
  background(190,255,40);
  
  fill(text_color);
  stroke(0);
  strokeWeight(2);
  textSize(50);
  textAlign(CENTER);
  text("Quick Sort Simulation",width/2,60);
  
  if (game_state == 0) {
    
    if (started) {
      show_stage_info("Press ENTER to restart")
    } else {
      show_stage_info("Press ENTER to begin")
    }
    
  } else if (game_state == 1) {
    
    show_stage_info("Creating random data...")
    begin_sim();
    
  } else if (game_state == 2) {
    
    show_stage_info("Sorting...")
    sort_stage();
    
  }
  
  for (let i = 0; i < num_values; i++) {
    values[i].display();
  }
}

function keyPressed() {
  if (game_state == 0) {
    if (keyCode == ENTER) {
      game_state = 1;
      started = true;
    }
  }
}

function begin_sim() {
  if ((millis() - t0) >= 100) {
    if (fill_index == values.length) {
      fill_index = 0;
      game_state += 1;  
      
      let seg = [];
      for (let i = 0; i < num_values; i++) {
        seg[i] = values[i];
      }
      segments[0] = seg;
      return;
    }
    
    t0 = millis();
    values[fill_index].value = floor(random(1000));
    fill_index += 1;
  }
}

function sort_stage() {
  if ((millis() - t0) >= 500) {
    t0 = millis();
    
    if (segments.length == num_values) {
      for (let i = 0; i < segments.length; i++) {
        values[segments[i][0].index] = segments[i][0];
      }
      
      game_state = 0;
      fill_index = 0;
      completed = [];
      segments = [];
      selected = -1;
      
      return;
    }

    let seg = segments[fill_index];
    if (seg.length == 1) {
      fill_index++;
      if (fill_index >= segments.length) {
        fill_index = 0;
      }
      t0 -= 1000;
      return;
    } 
      
    if (action == 0) {
      action = 1;
      
      if (selected != -1) {
        completed.push(selected);
      }
      selected = seg[floor(random(seg.length))];
      
    } else {
      action = 0;
      
      let jump = 1;
      let lower_values = [];
      let higher_values = [];
      
      for (let i = 0; i < seg.length; i++) {
        if (seg[i] == selected) {
          continue;
        }
        if (seg[i].value < selected.value) {
          lower_values.push(seg[i]);
        } else {
          higher_values.push(seg[i]);
        }
      }
      
      let new_values = []
      
      if (lower_values.length > 0) {
        new_values.push(lower_values);
        jump++;
      }
      
      new_values.push([selected]);
      
      if (higher_values.length > 0) {
        new_values.push(higher_values);
        jump++;
      }
      
      
      let new_segments = segments.slice(0,fill_index);
      new_segments = new_segments.concat(new_values);
      new_segments = new_segments.concat(segments.slice(fill_index+1,segments.length));
      segments = new_segments;
      
      
      fill_index += jump;
      if (fill_index >= segments.length) {
        fill_index = 0;
      }
    }
    reposition();
  }
}

function reposition() {
  let total_index = 0;
  for (let i = 0; i < segments.length; i++) {
    for (let j = 0; j < segments[i].length; j++) {
      segments[i][j].index = total_index;
      segments[i][j].move();
      total_index += 1;
    }
  }
}

function show_stage_info(info) {
  fill(text_color);
  stroke(0);
  strokeWeight(2);
  textSize(30);
  textAlign(CENTER);
  text(info,width/2,height-30);
}