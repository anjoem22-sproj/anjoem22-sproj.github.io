var t0;
var game_state;

var values;
var segments;

var num_values;
var text_color;

var started;

var fill_index;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent("mergesort");
  cnv.center("horizontal");
  
  colorMode(HSB);
  text_color = color(170,10,240);
  
  // gamestates: 
  // 0 = Pre-start - Does nothing until user begins
  // 1 = Fill Stage - fills array with random numbers
  // 2 = Split stage - splits the data into small segments
  // 3 = Merge stage - merges segments back together
  game_state = 0;
  t0 = 0;
  
  num_values = 10;
  
  values = [];
  segments = [];
  
  started = false;
  
  fill_index = 0;
  
  for (let i = 0; i < num_values; i++) {
    values[i] = new Box(-1,i);
  }
}

class Box {
  constructor(value,index) {
    let screen_fraction = (0.8*width)
    this.size = screen_fraction/(num_values);
    
    this.value = value;
    this.index = index; 
    
    this.x = this.size * (this.index+0.5) + (width-screen_fraction)/2;
    this.y = height/2;
  }
  
  display() {
    rectMode(CENTER);
    stroke(255);
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
}

function draw() {
  background(190,255,40);
  
  fill(text_color);
  stroke(0);
  strokeWeight(2);
  textSize(50);
  textAlign(CENTER);
  text("Merge Sort Simulation",width/2,60);
  
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
    
    show_stage_info("Splitting array...")
    split_stage();
    
    
  } else if (game_state == 3) {
    
    show_stage_info("Merging values together...")
    merge_stage();
    
  }
  
  for (let i = 0; i < num_values; i++) {
    values[i].display();
  }
}

function keyPressed() {
  if (game_state == 0) {
    if (keyCode == ENTER) {
      game_state = 1;
    }
  }
}

function begin_sim() {
  if ((millis() - t0) >= 100) {
    if (fill_index == values.length) {
      started = true;
      fill_index = 0;
      game_state += 1;
      
      let new_segment = [];
      for (let i = 0; i < num_values; i++) {
        new_segment[i] = values[i];
      }
      segments[0] = new_segment;
      
      return;
    }
    
    t0 = millis();
    values[fill_index].value = floor(random(1000));
    fill_index += 1;
  }
}

function split_stage() {
  if ((millis() - t0) >= 500) {
    t0 = millis();
    
    if (segments.length == num_values) {
      game_state += 1;
      return;
    }
    
    let new_segments = []
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].length == 1) {
          new_segments.push(segments[i]);
          continue;
        }
        
        let segment = segments[i];
        let size = segment.length;
        new_segments.push(segment.slice(0,floor(size/2)));
        new_segments.push(segments[i].slice(floor(size/2)));
    }
    segments = new_segments;
    move_segments();
  }
}

function merge_stage() {
  if ((millis() - t0) >= 500) {
    t0 = millis();
    
    if (segments.length == 1) {
      values = segments[0];
      fill_index = 0;
      game_state = 0;
      return;
    }
    
    let new_segment = merge(segments[fill_index],segments[fill_index+1])
    segments[fill_index] = new_segment;
    segments.splice(fill_index+1,1);
    
    fill_index++;
    if (fill_index == segments.length - 1) {
      fill_index = fill_index - 1;
    } else if (fill_index >= segments.length) {
      fill_index = 0;
    }
    
    move_segments();
  }
}

function merge(seg1,seg2) {
  let new_seg = [];
  
  let i = 0;
  let j = 0;
  let total_size = seg1.length + seg2.length;
  
  for (let k = 0; k < total_size; k++) {
    if (i == seg1.length) {
      new_seg.push(seg2[j]);
      j++;
      
    } else if (j == seg2.length) {
      new_seg.push(seg1[i]);
      i++;
      
    } else {
      
      if (seg1[i].value < seg2[j].value) {
        new_seg.push(seg1[i]);
        i++;
        
      } else {
        new_seg.push(seg2[j]);
        j++;
        
      }
      
    }
  }
    
  return new_seg;
}

function move_segments() {
  let screen_fraction = (0.8*width)
  let size = screen_fraction/(num_values);
  let x0 = ((width-screen_fraction)/2) + (size/2) - (7.5*(segments.length-1));
  
  let total_index = 0;
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    for (let j = 0; j < segment.length; j++) {
      segment[j].x = x0 + (size*total_index) + (15*i);
      total_index++;
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