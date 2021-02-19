var text_color;
var game_state;

function setup() {
  createCanvas(800, 400);
  colorMode(HSB)
  
  text_color = color(170,10,240)
  game_state = 0;
}

function load_main_menu() {
  fill(text_color)
  textAlign(CENTER)
  textSize(40)
  text("The Blind Runes",width/2,50)
  
  fill(0)
  rect(0.125 * width,70,0.75 * width, 0.5 * height)
  
  fill(text_color)
  textAlign(LEFT)
  textSize(20)
  text("You are equipped with 10 powerful runes. You are tasked to order the runes in terms of power. Interacting with more than two runes at one time could destroy the whole world! In order to sort the runes, you are permitted to evaluate two runes against eachother and swap their positions. Have fun!", 0.2 * width,90,0.61 * width, 0.5 * height)
  
  textAlign(CENTER)
  text("PRESS SPACE TO BEGIN",0.5 * width, 0.9 * height)
}


function draw() {
  background(190,255,40);
  
  if (game_state == 0) {
    load_main_menu();
  } else if (game_state == 1) {
    
  }
  
}