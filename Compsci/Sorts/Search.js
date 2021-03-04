var gamemode;
var text_color;

var num_guesses;
var guessed_num;
var upper_guess;
var lower_guess;
var actual_num;

var input_box;
var input_button;

var victory_state;

function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent('search');
  cnv.center('horizontal');
  colorMode(HSB);
  text_color = color(170,10,240);
  
  gamemode = 0;
  num_guesses = 0;
  guessed_num = -1;
  actual_num = 0;
  
  upper_guess = 100;
  lower_guess = 1;
  victory_state = 0;
}



function draw() {
  background(190,255,40);
  
  textAlign(CENTER);
  fill(text_color);
  stroke(0);
  strokeWeight(2);
  
  if (gamemode == 0) {
    textSize(50);
    text("Welcome to the Guessing Game!",width/2,50);
    
    textSize(30);
    text("Press 1 to Have the Computer Guess Your Number",width/2,height/2 - 30);
    text("Press 2 to Guess the Computer's Number",width/2,height/2 + 30);
    
  } else if (gamemode == 1) {
    if (victory_state != 1) {
      textSize(40);
      text("Pick a number from 1-100",width/2,40);
      text("Is it...",width/2 - 90,130);
      
      textSize(20);
      text("If I guessed it, press ENTER",width/2,height-130);
      text("If your number is higher, press the up arrow key",width/2,height-100);
      text("If your number is lower, press the up arrow key",width/2,height-70);
      
      textSize(60);
      text("" + floor((upper_guess+lower_guess)/2) + "?",width/2,height/2);
      
    } else {
      textSize(40);
      text("I win!",width/2,40);
      text("Your number is...",width/2,100);
      
      textSize(20);
      text("Press ENTER to go to the main menu",width/2,height-130);
      
      textSize(60);
      text("" + floor((upper_guess+lower_guess)/2),width/2,height/2);
    }
   
    textSize(20);
    if (victory_state != -1) {
      text("" + num_guesses + " guesses have been made.",width/2,height-20);
    } else {
      text("Hmm... Something went wrong. Did you pick a number 1-100? Press ENTER to restart.",width/2,height-20);
    }
  } else if (gamemode == 2) {
    textSize(40);
    text("I'm thinking of a number 1-100...",width/2,40);
    
    textSize(60);
    if (guessed_num == -1) {
      text("Make a guess!",width/2,height/2);
    } else if (guessed_num != actual_num) {
      if (guessed_num > actual_num) {
        text("" + guessed_num + " is too high, try again",width/2,height/2);
      } else { 
        text("" + guessed_num + " is too low, try again",width/2,height/2);
      }
    } else if (guessed_num == actual_num) {
      victory_state = 1;
      text("Victory, the number was " + guessed_num,width/2,height/2);
      textSize(20);
      text("Press ENTER to return to the menu",width/2,height/2 + 30);
    }
    
    textSize(20);
      text("You made " + num_guesses + " guesses.",width/2,height - 20);
    
    let in_text = input_box.value();
    in_text = in_text.slice(0,3);
    
    input_box.value(in_text);
    in_text = floor(parseFloat(in_text));
  }
}

function keyPressed() {
  if (gamemode == 0) {
    if (keyCode == 49) {
      num_guesses = 0;
      upper_guess = 100;
      lower_guess = 1;
      gamemode = 1;
    } else if (keyCode == 50) {
      num_guesses = 0;
      actual_num = floor(random(100)+1);
      input_box = createInput('','number');
      input_box.position(windowWidth/2 - 80,height/1.5);
      input_button = createButton('Guess!');
      input_button.position(windowWidth/2 - 25,height/1.5 + 30);
      input_button.mousePressed(guess_made);
      gamemode = 2;
    }
  }
  
  if (gamemode == 1) {
    
    if (victory_state != 1) {
      if (keyCode == ENTER) {
        if (victory_state == -1) {
          num_guesses = 0;
          upper_guess = 100;
          lower_guess = 1;
          victory_state = 0;
          return;
        }
        victory_state = 1;
      } else if (keyCode == UP_ARROW) {
        let mid_num = floor((lower_guess+upper_guess)/2)
        if (lower_guess == mid_num) {
          victory_state = -1;
        } 

        if (victory_state == 0) {
          num_guesses++;
        }

        lower_guess = mid_num; 
        if (lower_guess == 99) {
          lower_guess = 100;
        } 
      } else if (keyCode == DOWN_ARROW) {
        let mid_num = floor((lower_guess+upper_guess)/2)
        if (lower_guess == mid_num) {
          victory_state = -1;
        } 

        if (victory_state == 0) {
          num_guesses++;
        }

        upper_guess = mid_num;
      }
    } else {
      if (keyCode == ENTER) {
        gamemode = 0;
        victory_state = 0;
      }
    }
    
  }
  
  if (gamemode == 2) {
    if (keyCode == ENTER & victory_state == 1) {
      guessed_num = -1;
      gamemode = 0;
      victory_state = 0;
      input_box.remove();
      input_button.remove();
    }
  }
}

function guess_made() {
  if (victory_state == 0 & input_box.value() != "") {
    num_guesses++;
    guessed_num = floor(parseFloat(input_box.value()));
  }
}