// https://kamranahmed.info/driver.js/

function square2element(square){
  return document.querySelectorAll('.square-' + square)[0]
}

function is_element_square(element, square){
  return String(element.node.classList).includes(square)
}






function driverjs_1(){
  const driver = new Driver({ onNext: (Element) => {
    if (is_element_square(Element, "b2")){
      board.move('a1-b4')
    }
    if (is_element_square(Element, "h5")){
      board.move('b4-g4')
    }
    if (is_element_square(Element, "g4")){
      board.position('2p1b3/8/8/8/8/8/8/8 w - - 0 1')
    }
  }, onReset: (Element) => {
    // current_level = default_level
    // current_puzzleID = default_puzzleID
    // loadAllPuzzles(current_level)
    // console.log("change current_level", current_level ) ;  
    // user_game_results = []
    // $("#slider-range-min").slider({value : current_level} ) 
    // loadGame(current_level, current_puzzleID)
    // console.log("CLOSING")
  }

  });
  // Define the steps for introduction
  driver.defineSteps([
    {
      element: square2element('a1'),
      popover: {
        title: 'Chess Pieces',
        description: 'This white pawn (♙) can capture an opponent\'s piece on squares diagonally in front of it.',
        position: 'bottom',
      }
    },
    {
      element: square2element('b2'),
      popover: {
        title: 'Visual hint',
        description: 'The small black numbers indicate the number of pieces (here only the pawn) that currently threaten this square.',
        position: 'bottom',
      }
    },
    {
      element: square2element('a5'),
      popover: {
        title: 'Changes',
        description: 'This number changes when you move the pawn. You don\'t have to follow chess rules for moving pieces, only to calculate the numbers.',
        position: 'top',
      }
    },
    {
      element: square2element('f5'),
      popover: {
        title: 'Threat number',
        description: 'The large number shows how many pieces threaten this square in the solution. The threats (colorful numbers) are calculated by chess rules but the pieces can move freely.',
        position: 'top',
      }
    },
    {
      element: square2element('h5'),
      popover: {
        title: 'Threat number',
        description: 'Can you guess where the pawn should go?',
        position: 'top',
      }
    },

    {
      element: square2element('g4'),
      popover: {
        title: 'Excellent, you guessed it correctly',
        description: 'Now all large numbers are green. Moving the pawn to this square matches the large and the small numbers and solves the puzzle. Are you ready for the next puzzle?',
        position: 'bottom',
      }
    },

    {
      element: square2element('e8'),
      popover: {
        title: 'Black pieces',
        description: 'While white pieces INCREASE the threat (+1), black pieces DECREASE the threat (-1).',
        position: 'top',
      }
    },
    {
      element: square2element('c8'),
      popover: {
        title: 'Black pawn',
        description: 'Unlike white pawns, black pawns threaten the squares below them.',
        position: 'top',
      }
    },

    {
      element: square2element('d7'),
      popover: {
        title: 'Total threat',
        description: '2 threats from black pieces means -2 total threats.',
        position: 'top',
      }
    },
    {
      element: '#levelSelector',
      popover: {
        title: 'Is this puzzle too difficult?',
        description: 'You can adjust puzzle difficulty by using this slider.',
        position: 'bottom',
      }
    },
    {
      element: '#moveswitch',
      popover: {
        title: 'Drag or click?',
        description: 'Is dragging a piece difficult or are you faster when you drag and drop? Use this switch to choose your preferred way of moving pieces around.',
        position: 'bottom',
      }
    },
  ]);
  driver.start() ;
}







function load_tutorials(){
  allPuzzles = [1,2,3,4]
  current_level = 999
  console.log("change current_level", current_level ) ;  
  user_game_results = []
  loadGame(current_level, 1)
// Start the introduction
  setTimeout(() =>   driverjs_1()  , 500) ;
}

function disable_all_components(){
  document.getElementById("board").style.display = "none";
  document.getElementById("puzzleLevelSelector").style.display = "none";
  document.getElementById("login-container").style.display = "none";
  document.getElementById("boardcontrol").style.display = "none";    
  document.getElementById("about").style.display = "none";
  document.getElementById("mailist").style.display = "none";
  document.getElementById("footer").style.display = "none";
  document.getElementById("rules").style.display = "none";
}

function current_date() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  return today.toDateString();
}
function homepuzzle(nextActive= true){
  console.log("homepuzzle")
  loadAllPuzzles(current_level)
  load_user_data()
  disable_all_components();
  document.getElementById("board").style.display = "block";

  document.getElementById("boardcontrol").style.display = "block";
  document.getElementById("footer").style.display = "block";
  if (nextActive){
    document.getElementById("puzzleLevelSelector").style.display = "block";
  }
  $('#infodate').text("");
  loadGame(current_level, current_puzzleID)
  reset();
  boardChangedUpdateGame();
}

function daily(){
  current_level = 365;
  current_puzzleID = dayofyear()
  homepuzzle(nextActive=false)
  $('#infodate').html("<p>Daily puzzle of " +  current_date() + "</p>");
}

function tutorial(){
  disable_all_components();
  document.getElementById("board").style.display = "block";
  document.getElementById("puzzleLevelSelector").style.display = "block";
  document.getElementById("boardcontrol").style.display = "block";
  load_tutorials();
}

function rules(){
  disable_all_components();
  document.getElementById("rules").style.display = "block";
  window.location.hash = 'rules'
}
function about(){
  disable_all_components();
  document.getElementById("about").style.display = "block";
  window.location.hash = 'about'
}

function subscription(){
  disable_all_components();
  document.getElementById("mailist").style.display = "block";   
  window.location.hash = 'mailist'
}

(function(){
  
  var menuElement = document.querySelector('header .menu-icon');
  var bodyElement = document.querySelector('body');

  bodyElement.onclick = function(e){
    document.querySelector('.side-bar').classList.remove('side-bar-visible');
        document.querySelector('.overlay').classList.remove('visible');
  }
  
  menuElement.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.side-bar').classList.add('side-bar-visible');
    document.querySelector('.overlay').classList.add('visible');
  }
  document.getElementById('item-mailist').onclick = function(e) {
    subscription()
  }
  document.getElementById('item-mailist-side').onclick = function(e) {
    subscription()
  }
  document.getElementById('item-home').onclick = function(e) {
    current_level = default_level;
    current_puzzleID = default_puzzleID;
    homepuzzle()
  }
  document.getElementById('item-home-side').onclick = function(e) {
    current_level = default_level;
    current_puzzleID = default_puzzleID;
    homepuzzle()
  }
  document.getElementById('item-daily').onclick = function(e) {
    daily()
  }
  document.getElementById('item-daily-side').onclick = function(e) {
    daily()
  }
  // ABOUT
  document.getElementById('item-info').onclick = function(e){
    disable_all_components();
    document.getElementById("about").style.display = "block";     
  }
  document.getElementById('item-info-side').onclick = function(e){
    disable_all_components();
    document.getElementById("about").style.display = "block";      
  }
  // RULES
  document.getElementById('item-rules').onclick = function(e){
    disable_all_components();
    document.getElementById("rules").style.display = "block";     
  }
  document.getElementById('item-rules-side').onclick = function(e){
    disable_all_components();
    document.getElementById("rules").style.display = "block";      
  }
  // LOGIN
  document.getElementById('item-login').onclick = function(e){
    disable_all_components();
    document.getElementById("login-container").style.display = "block";

  }
  document.getElementById('item-login-side').onclick = function(e){
    disable_all_components();
    document.getElementById("login-container").style.display = "block";   
  }

  // TUTORIAL IS BASICALLY HOME
  document.getElementById('item-tutorial').onclick = function(e){
    tutorial()
  }
  document.getElementById('item-tutorial-side').onclick = function(e){
    tutorial()
  }
})();