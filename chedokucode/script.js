function annotateSquare(sq, num, color = 'red') {
  squareObj = document.getElementsByClassName("square-" + sq);
  // console.log(">>>",  sq, square2index(sq), values [square2index(sq)] ,  num )
  squareObj[0].innerHTML = ' <div id="watermark" style="color:' + colorDiff(Math.abs(values[square2index(sq)] - num)) + '; ">' + num + '</div>';
}

function annotate(puzzleNumbers) {
  for (var key in puzzleNumbers) {
    annotateSquare(key, puzzleNumbers[key], 'red');
    // console.log("<annotate>:", key, puzzleNumbers[key] );
  }
}

function millisecondsToStr(milliseconds) {
  min = Math.floor((milliseconds / 1000 / 60) << 0);
  sec = Math.floor((milliseconds / 1000) % 60);
  if (min == 0) {
    return (" " + sec + " seconds ")
  } else {
    return (" " + min + " minutes " + sec + " seconds ")
  }
}

function cuteToast(type, message, socialmedia_url, socialmedia_text) {

  if (type == 'reset') {
    document.getElementById("alert-notification").style.display = "none";
  } else {
    document.getElementById("alert-notification").style.display = "block";
    document.getElementById("alert-notification").className = "alert alert-" + type;
    document.getElementById("notification-text").innerHTML = message
      + ` &nbsp; &nbsp;
      <a href="http://www.facebook.com/share.php" id="notification-facebook" ><img src="static/social/fb.png" alt="Share this Chedoku on Facebook" border="0" rel="nofollow noopener"/></a>
      <a href="http://twitter.com/intent/tweet" id="notification-twitter" ><img src="static/social/twitter.png" alt="Tweet this Chedoku" border="0" rel="nofollow noopener" /></a>
      <b style="display:inline" id="cliboardinput"></b>
      <button style="display:inline;width: 25px;border: 0;" class="btn" onclick="copyContent()"><img src="static/clipboard.svg" border="0" /></button>
    `

    document.querySelector('#notification-facebook').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(socialmedia_url);
    document.querySelector('#notification-twitter').href = 'https://twitter.com/intent/tweet?text=' + socialmedia_text + encodeURIComponent(socialmedia_url);
    document.querySelector('#cliboardinput').text = socialmedia_text + socialmedia_url;

    $('#alert-notification').fadeIn(100);
  }
}

function levelPuzzle() {
  loadAllPuzzles(current_level)
  setTimeout(() => load_user_data(), 300)
  setTimeout(() => {
    reset();
    boardChangedUpdateGame();
  }, 1000)
}

function boardChangedUpdateGame() {
  //console.log("boardChangedUpdateGame");
  annotate(puzzleNumbers);
  game.load(board.fen() + ' ' + 'w' + ' - - 0 1')
  var fen = game.fen();
  // console.log("fen", fen);
  if (game.turn() == 'b') {
    influence($('#board'), fen)
  } else {
    influence($('#board'), fenForOtherSide(fen))
  }
  board.position(fen);
}


function checkSolution() {
  solution = true;
  foundStrictSolution = true
  if (puzzleSolution.length < 1) return
  for (var key in puzzleNumbers) {
    if (puzzleNumbers[key] != values[square2index(key)]) { solution = false }
  }
  for (var i = 0; i < values.length; i++) {
    key = index2square(i)
    if (values[i] != 0 && !(key in board.position()) && values[i] != puzzleNumbers[key]) {
      foundStrictSolution = false;
      if (strictSolution) {
        solution = false;
      }
    }
  }

  var end = new Date().getTime();
  var dur = ((end - current_puzzle_timer) / 1000).toFixed(0);
  var durStr = millisecondsToStr(end - current_puzzle_timer)
  var date = new Date();
  date = date.toDateString()

  if (dur > 0 && solution) {
    if (foundStrictSolution) {
      msg = `Congratulations! You found the perfect solution in ${current_puzzle_moves} moves and ${durStr}. Do you want to share it with your friends? `
      msgtype = "success"
      if (current_level == 365) {
        socialmedia_text = `I found the perfect solution for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found the perfect solution for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    } else {
      msg = `Congratulations! You found a valid solution in ${current_puzzle_moves} moves and ${durStr}. You can keep playing to find the perfect solution that has no additional threats on empty squares,   <a href="#Foo" onclick="rules(); return false;">Learn more about rules</a> .`
      msgtype = "warning"
      if (current_level == 365) {
        socialmedia_text = `I found a solution for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found a solution for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    }

    cuteToast(type = msgtype, message = msg, socialmedia_url = socialmedia_url, socialmedia_text = socialmedia_text)
    // t: time, m: number of moves, l: level, gid: puzzleid
    user_game_results.push({ "t": dur, "m": current_puzzle_moves, 'l': current_level, 'gid': current_puzzleID });
    try {
      update_user_data();
    }
    catch (e) {
      console.log("User is not logged in to save played games")
    }
  }
}


async function copyContent() {
  try {
    await navigator.clipboard.writeText(document.querySelector('#cliboardinput').text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


//function highlightSquare(boardElement, square, style) {
//  boardElement.find('.square-' + square).addClass(style);
//}

function influence(boardElement, fen) {
  defenders = allSquares.map(s => countSquareDefenders(boardElement, fen, s, true))
  attackers = allSquares.map(s => countSquareDefenders(boardElement, fenForOtherSide(fen), s, false))
  var styleNotation = 'numeric-top-right'

  allSquares.forEach(function (square, i) {
    values[i] = defenders[i] - attackers[i]
    if (current_showhint) {
      $('.square-' + square).find('.notation-322f9').remove()
      if (values[i] == 0 || square in board.position()) {
        $('.square-' + square).append('<div style="color:black"class="notation-322f9 ' + styleNotation + '"></div>')
      } else {
        $('.square-' + square).append('<div style="color:black"class="notation-322f9 ' + styleNotation + '">' + values[i] + '</div>')
      }
    }
    //var styleInfluence = parseInt(values[i]) > 0 ? 'blue-influence' : 'red-influence'
    //var absValue = Math.abs(values[i])
    //highlightSquare(boardElement, square, styleInfluence + '-' + absValue)
  });
}

function countSquareDefenders(boardElement, fen, square, me) {
  var chess = new Chess(fenForOtherSide(fen));
  //console.log("countSquareDefenders", chess.fen())
  var oppositeColor = chess.turn() == 'w' ? 'b' : 'w'

  var queenSquare = squaresOfPiece(fen, oppositeColor, 'q');
  var somePiece = chess.remove(square); // remove my piece if any
  chess.remove(queenSquare); // remove his king
  chess.put({ // put queen in the square
    type: 'q',
    color: oppositeColor
  }, square);

  var moves = chess.moves({ verbose: true, legal: false, promotion: 'q' })
  // A flags value of pc would mean that a pawn captured a piece on the 8th rank and promoted.
  // 4 promotions are possible, we only take the promotion to queen
  var defendersCount = moves.filter(m => m.to == square && (m.flags == 'c' || (m.flags == 'cp' && m.promotion == 'q'))).length
  if (somePiece && somePiece.color != oppositeColor) // count our own piece as controlling that square
    defendersCount = parseInt(defendersCount) + 1

  return defendersCount
}

function squaresOfPiece(fen, colour, pieceType) {
  var chess = new Chess(fen);
  return allSquares.find(square => {
    var r = chess.get(square);
    return r === null ? false : (r.color == colour && r.type.toLowerCase() === pieceType);
  });
}


function fenForOtherSide(fen) {
  return (fen.search(" w ") > 0) ?
    fen.replace(/ w .*/, " b - - 0 1") :
    fen.replace(/ b .*/, " w - - 0 2");
}

function getMultipleRandom(arr, num) {
  //const shuffled = [...arr].sort(() => 0.5 - Math.random());
  //return shuffled.slice(0, num);

  // deterministic placement
  return arr.slice(0, num);
}

function initialPieces(pieces) {
  numKeyArray = Object.keys(puzzleNumbers)
  difference = allSquares.filter(x => !numKeyArray.includes(x));  // allSquares - puzzleNumbers
  initialSquares = difference.slice(0, Object.keys(pieces).length)
  //console.log("initialSquares", initialSquares)
  var positionPieces = {}
  var i = 0
  for (var key in pieces) {
    positionPieces[initialSquares[i]] = pieces[key]
    i++
  }
  return positionPieces
}
function handler() {
  if (current_draggable) return
  square = this.dataset["square"] // $(this).data("square");
  console.log("clicked on " + square);

  if (square in board.position()) { // click on a piece 
    if (squareSource == null) {
      console.log("Source is selected");
      $(this).addClass('myhighlight');
      squareSource = square
    } else {
      console.log("Source is Changed");
      boardtag.find('.square-' + squareSource).removeClass('myhighlight');
      $(this).addClass('myhighlight');
      squareSource = square
    }
  } else if (squareSource != null && !(square in puzzleNumbers)) { // source is already clicked and a number is not clicked
    console.log("empty square, possible to move the piece = destination clicked")
    squareDestination = square
    board.move(squareSource + '-' + squareDestination)
    boardtag.find('.square-' + squareSource).removeClass('myhighlight');
    squareSource = null
    squareDestination = null
  }
}

function registerSquareOnClickHandler() {
  for (i in allSquares) {
    square = allSquares[i]
    //console.log(square)
    boardtag.find('.square-' + square).click(handler)
  }
}

function dayofyear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day
}


function reset() {
  // console.log("puzzlePieces", puzzlePieces)
  var cfg = {
    dropOffBoard: dropOffBoard,
    sparePieces: sparePieces,
    draggable: current_draggable,
    position: initialPieces(puzzlePieces),
    onDrop: onDrop,
    onMoveEnd: onMoveEnd,
    onChange: onChange,
    onSnapEnd: onSnapEnd,
    showNotation: false
  };
  board.clear(false)
  board.destroy()
  board = ChessBoard('board', cfg);
  registerSquareOnClickHandler()
}

function base_url() {
  //window.location.href.split('?')[0]
  return window.location.origin + window.location.pathname;
}

function loadAllPuzzles() {
  //console.log("loading level", current_level)
  let path = base_url()
  jsonUrl = path + '/puzzles/level' + current_level + '/list.json'
  $.getJSON(jsonUrl, function (data) {
    //console.log(data)
    allPuzzles = data['puzzles']
  });
}

function loadPuzzle(level, puzzleID) {
  let path = base_url()
  jsonUrl = path + '/puzzles/level' + level + '/' + puzzleID + '.json'
  // console.log(puzzleID, jsonUrl)
  $.getJSON(jsonUrl, function (data) {
    puzzleSolution = data['puzzleSolution']
    puzzlePieces = data['puzzlePieces']
    puzzleNumbers = data['puzzleNumbers']
    sparePieces = data['sparePieces']
    if (sparePieces)
      dropOffBoard = 'trash'
    else
      dropOffBoard = 'snapback'
    strictSolution = data['strictSolution']
    reset()
    boardChangedUpdateGame();
    //boardChangedUpdateGame();
    $('#infotext1').html('Challenge yourself by adjusting the difficulty level: <b> ' + current_level + '</b>');
    $('#infotext2').html('Puzzle ID: <b> ' + puzzleID + '</b>');
    document.getElementById("offboard_item").checked = (dropOffBoard == 'trash');
    document.getElementById("strictmode_item").checked = strictSolution;

    current_puzzle_timer = new Date().getTime();
    current_puzzle_moves = 0;
    hashParams['gid'] = puzzleID;
    hashParams['d'] = level;
    if (window.location.hash == 'about') {
      window.location.hash = 'about'
    } else if (window.location.hash == 'rules') {
      window.location.hash = 'rules'
    } else if (current_level < 50) {
      updateHash(hashParams)
    } else if (current_level == 365) {
      window.location.hash = 'dailypuzzle'
    } else if (current_level == 999) {
      window.location.hash = 'tutorial'
    }

  }).fail(function () {
    console.log("ERROR loading puzzle")
    current_puzzleID = current_puzzleID
    index = 0
  });

}

var onSnapEnd = function () {
  // console.log("onSnapEnd");
  boardChangedUpdateGame();
};

var onChange = function (oldPos, newPos) {
  current_puzzle_moves = current_puzzle_moves + 1;
  // console.log("onChange", board.fen());
  // boardChangedUpdateGame();
  // Throwing piece outside the board doesnot trigger any event that has the new board position, a hack to bypass this.
  setTimeout(() => onChangeHook(), 100)

};
function onChangeHook() {
  boardChangedUpdateGame()
  checkSolution()
}




var onMoveEnd = function (oldPos, newPos) {
  // console.log("onMoveEnd", board.fen());
  boardtag.find('.square-' + squareToHighlight).addClass('myhighlight')
  boardChangedUpdateGame();
};

var onDrop = function (source, target) {
  // avoid incorrect moves, piece over another piece and piece over number
  // console.log("onDrop", target, puzzleNumbers)
  if (target in puzzleNumbers) return 'snapback'
  if (target in board.position()) return 'snapback'

  return;
};

function index2square(i) {
  return allSquares[i];
}

function square2index(sq) {
  return allSquares.indexOf(sq);
}

function colorDiff(num) {
  switch (num) {
    case 0:
      return '#69B34C'
    case 1:
      return '#FAB733'
    case 2:
      return '#FF8E15'
    case 3:
      return '#FF4E11'
    default:
      return '#FF0D0D'
  }
}


function loadGame(level, puzzleID) {
  if (puzzleID == 'undefined') {
    current_level, current_puzzleID = findUnsolvedPuzzle()
  } else {
    current_level = level;
    current_puzzleID = puzzleID;
  }

  loadPuzzle(current_level, current_puzzleID)
  board = ChessBoard('board')
  $(window).resize(board.resize)
  reset();

  // https://github.com/oakmac/chessboardjs/pull/150#issuecomment-428197711
  jQuery('#chess_board').on('scroll touchmove touchend touchstart contextmenu', function (e) {
    e.preventDefault();
  });
}


function parseHash() {
  try {
    var hash = window.location.hash.substr(1);
    var result = hash.split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});
    return result
  }
  catch (e) {
    return []
  }
}

function updateHash(hashParams) {
  var hash = ''
  for (k in hashParams) {
    if (k.length > 0) {
      hash = hash + (k + '=' + hashParams[k] + '&')
    }
  }
  console.log(hash)
  window.location.hash = hash
}

function puzzleids(lvl) {
  return (user_game_results.filter(x => x['level'] == lvl).map(x => x['gid']))
}


function findUnsolvedPuzzle() {
  allPuzzleKeys = Object.keys(allPuzzles)
  playedPuzzleKeys = puzzleids(current_level)
  notPlayedKeys = allPuzzleKeys.filter(x => !playedPuzzleKeys.includes(x));
  //console.log(">>>> allPuzzleKeys:", allPuzzleKeys, "playedPuzzleKeys:", playedPuzzleKeys, "Random puzzle:", notPlayedKeys[index])
  current_puzzleID = notPlayedKeys[index]
  index = index + 1
  if (notPlayedKeys.length < 1) {
    current_level++
    current_puzzleID = 1
  }
  return (current_level, current_puzzleID)
}


function load_user_data() {
  try {
    database.ref().child('game_played/' + firebase.auth().currentUser.uid).once('value').then(function (lead) {
      //console.log(lead.val().user_game_results);
      user_game_results = JSON.parse(lead.val());
      console.log("user_game_results:", user_game_results)
    });
  } catch (error) {
    user_game_results = []
  }
  setTimeout(() => loadGame(current_level, current_puzzleID), 200)
}

function update_user_data() {
  // this will sync user_game_results with server
  // console.log(firebase.auth().currentUser.email)
  const database = firebase.database()
  var database_ref = database.ref()
  user = firebase.auth().currentUser
  if (Object.keys(user_game_results).length > 0) {
    console.log("JSON user_game_results", JSON.stringify(user_game_results))
    database_ref.child('game_played/' + user.uid).set(JSON.stringify(user_game_results))
  }
}



var game = new Chess();
var allSquares = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'];
var defenders = []
var attackers = []
var values = []
var puzzlePieces = {}
var puzzleSolution = {}
var puzzleNumbers = {}
var sparePieces = true
var dropOffBoard = 'snapback'
var default_puzzleID = 1
var default_level = 3
var current_level = default_level
var current_puzzle_timer = new Date().getTime();
var current_puzzle_moves = 0
var allPuzzles
var hashParams = []
var user_game_results = {}
user_game_results[current_level] = {}
var index = 1
var boardtag = $('#board')
var game = new Chess()
var squareClass = 'square-55d63'
var squareToHighlight = null
var squareSource = null
var squareDestination = null
var current_draggable = false
var current_showhint = true

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}
if (isTouchDevice()) {
  current_draggable = false
  document.getElementById("switch-move").checked = true
  document.getElementById("switch-move").value = "off"
} else {
  //console.log("PC, click move")
  current_draggable = true
  document.getElementById("switch-move").checked = false
  document.getElementById("switch-move").value = "on"
}

$('#reset').on('click', function () {
  reset()
  boardChangedUpdateGame();
})

$('#dailybutton').on('click', function () {
  console.log("daily")
  disable_all_components()
  daily()
})
$('#solution').on('click', function () {
  var cfg = {
    dropOffBoard: dropOffBoard,
    sparePieces: sparePieces,
    draggable: current_draggable,
    position: puzzleSolution,
    onDrop: onDrop,
    onMoveEnd: onMoveEnd,
    onChange: onChange,
    onSnapEnd: onSnapEnd,
    showNotation: false
  };
  board.clear(false)
  board.destroy()
  board = ChessBoard('board', cfg);
  $(window).resize(board.resize)
  current_puzzle_timer = new Date().getTime();
  boardChangedUpdateGame();
})


$(document).ready(function () {

  $('.popup-overlay').css("display", "flex").hide().fadeIn();

  $('a.popup-daily').click(function () {
    $('.popup-overlay').fadeOut();
    daily()
  });

  $('a.popup-tutorial').click(function () {
    $('.popup-overlay').fadeOut();
    tutorial()
  });

  $('a.popup-rules').click(function () {
    $('.popup-overlay').fadeOut();
    rules()
  });

  $('a.popup-subscription').click(function () {
    $('.popup-overlay').fadeOut();
    subscription()
  });

  $('a.popup-levelpuzzle').click(function () {
    $('.popup-overlay').fadeOut();
    //levelpuzzle()
  });


  $('input[id="switch-move"]').click(function () {
    current_draggable = !$(this).prop("checked")
    reset();
    boardChangedUpdateGame();
  });

  $('input[id="switch-hint"]').click(function () {
    current_showhint = !$(this).prop("checked")
    reset();
    boardChangedUpdateGame();
  });
  if (window.location.hash.includes('daily')) {
    daily()
  } else if (window.location.hash.includes('tutorial')) {
    tutorial()
  } else if (window.location.hash.includes('rules')) {
    rules()
  } else if (window.location.hash.includes('about')) {
    about()
  }
  else {
    levelPuzzle()
  }
});

$('#next').on('click', function () {
  cuteToast(type = "reset", message = '')
  loadGame('undefined', 'undefined')
})

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'y' && e.altKey) {
    // Add your code here
    var valuesDict = new Object();
    for (var i = 0; i < values.length; i++) {
      //console.log(i, valuesDict, values[i], index2square(i))
      if (values[i] != 0 && !(index2square(i) in board.position())) {
        valuesDict[index2square(i)] = values[i]
      }
    }
    cuteToast(type = "success", message = JSON.stringify(board.position()) + JSON.stringify(valuesDict))
  } else if (e.key.toLowerCase() === 'n' && e.altKey) {
    puzzleSolution = {}
    puzzlePieces = {}
    puzzleNumbers = {}
    values = []
    sparePieces = true
    dropOffBoard = 'trash'
    reset()
    boardChangedUpdateGame();
  }
});

hashParams = parseHash()

try {
  current_puzzleID = hashParams['gid']
  current_level = hashParams['d']
  if (current_puzzleID === undefined || current_level === undefined) {
    current_level = default_level
    current_puzzleID = default_puzzleID
    homepuzzle()
  }
} catch (e) {
  current_level = default_level
  current_puzzleID = default_puzzleID
}


$(function () {
  $("#slider-range-min").slider({
    range: "min",
    value: current_level,
    min: 1,
    max: 20,
    slide: function (event, ui) {
      $("#level").val(ui.value);
      current_level = ui.value
      current_puzzleID = default_puzzleID
      loadAllPuzzles(current_level)
      cuteToast(type = "reset", message = '')
      loadGame(current_level, current_puzzleID)
    }
  });
});


// https://kamranahmed.info/driver.js/

function square2element(square) {
  return document.querySelectorAll('.square-' + square)[0]
}

function is_element_square(element, square) {
  return String(element.node.classList).includes(square)
}






function driverjs_1() {
  const driver = new Driver({
    onNext: (Element) => {
      if (is_element_square(Element, "b2")) {
        board.move('a1-b4')
      }
      if (is_element_square(Element, "h5")) {
        board.move('b4-g4')
      }
      if (is_element_square(Element, "g4")) {
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
  driver.start();
}







function load_tutorials() {
  allPuzzles = [1, 2, 3, 4]
  current_level = 999
  console.log("change current_level", current_level);
  user_game_results = []
  loadGame(current_level, 1)
  // Start the introduction
  setTimeout(() => driverjs_1(), 500);
}

function disable_all_components() {
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
function homepuzzle(nextActive = true) {
  console.log("homepuzzle")
  loadAllPuzzles(current_level)
  load_user_data()
  disable_all_components();
  document.getElementById("board").style.display = "block";

  document.getElementById("boardcontrol").style.display = "block";
  document.getElementById("footer").style.display = "block";
  if (nextActive) {
    document.getElementById("puzzleLevelSelector").style.display = "block";
  }
  $('#infodate').text("");
  loadGame(current_level, current_puzzleID)
  reset();
  boardChangedUpdateGame();
}

function daily() {
  current_level = 365;
  current_puzzleID = dayofyear()
  homepuzzle(nextActive = false)
  $('#infodate').html("<p>Daily puzzle of " + current_date() + "</p>");
}

function tutorial() {
  disable_all_components();
  document.getElementById("board").style.display = "block";
  document.getElementById("puzzleLevelSelector").style.display = "block";
  document.getElementById("boardcontrol").style.display = "block";
  load_tutorials();
}

function rules() {
  disable_all_components();
  document.getElementById("rules").style.display = "block";
  window.location.hash = 'rules'
}
function about() {
  disable_all_components();
  document.getElementById("about").style.display = "block";
  window.location.hash = 'about'
}

function subscription() {
  disable_all_components();
  document.getElementById("mailist").style.display = "block";
  window.location.hash = 'mailist'
}

(function () {

  var menuElement = document.querySelector('header .menu-icon');
  var bodyElement = document.querySelector('body');

  bodyElement.onclick = function (e) {
    document.querySelector('.side-bar').classList.remove('side-bar-visible');
    document.querySelector('.overlay').classList.remove('visible');
  }

  menuElement.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.side-bar').classList.add('side-bar-visible');
    document.querySelector('.overlay').classList.add('visible');
  }
  document.getElementById('item-mailist').onclick = function (e) {
    subscription()
  }
  document.getElementById('item-mailist-side').onclick = function (e) {
    subscription()
  }
  document.getElementById('item-home').onclick = function (e) {
    current_level = default_level;
    current_puzzleID = default_puzzleID;
    homepuzzle()
  }
  document.getElementById('item-home-side').onclick = function (e) {
    current_level = default_level;
    current_puzzleID = default_puzzleID;
    homepuzzle()
  }
  document.getElementById('item-daily').onclick = function (e) {
    daily()
  }
  document.getElementById('item-daily-side').onclick = function (e) {
    daily()
  }
  // ABOUT
  document.getElementById('item-info').onclick = function (e) {
    disable_all_components();
    document.getElementById("about").style.display = "block";
  }
  document.getElementById('item-info-side').onclick = function (e) {
    disable_all_components();
    document.getElementById("about").style.display = "block";
  }
  // RULES
  document.getElementById('item-rules').onclick = function (e) {
    disable_all_components();
    document.getElementById("rules").style.display = "block";
  }
  document.getElementById('item-rules-side').onclick = function (e) {
    disable_all_components();
    document.getElementById("rules").style.display = "block";
  }
  // LOGIN
  document.getElementById('item-login').onclick = function (e) {
    disable_all_components();
    document.getElementById("login-container").style.display = "block";

  }
  document.getElementById('item-login-side').onclick = function (e) {
    disable_all_components();
    document.getElementById("login-container").style.display = "block";
  }

  // TUTORIAL IS BASICALLY HOME
  document.getElementById('item-tutorial').onclick = function (e) {
    tutorial()
  }
  document.getElementById('item-tutorial-side').onclick = function (e) {
    tutorial()
  }
})();