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
      if (current_level > 2020 &&  current_level < 2050) {
        socialmedia_text = `I found the perfect solution for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found the perfect solution for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    } else {
      msg = `Congratulations! You found a valid solution in ${current_puzzle_moves} moves and ${durStr}. You can keep playing to find the perfect solution that has no additional threats on empty squares,   <a href="#Foo" onclick="rules(); return false;">Learn more about rules</a> .`
      msgtype = "warning"
      if (current_level > 2020 &&  current_level < 2050) {
        socialmedia_text = `I found a solution for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found a solution for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://www.chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    }

    cuteToast(type = msgtype, message = msg, socialmedia_url = socialmedia_url, socialmedia_text = socialmedia_text)
    // t: time to completion, m: number of moves, l: level, gid: puzzleid, ts: Timestamp, st: solution type
    newItem = { "t": parseInt(dur), "m": parseInt(current_puzzle_moves), 'l': parseInt(current_level), 'gid': parseInt(current_puzzleID), 'ts': Date.now(), 'st': foundStrictSolution }
    db_result  = user_game_results.find(element => element.l ==current_level && element.gid == current_puzzleID);
    resultIndex= user_game_results.findIndex(element => element.l ==current_level && element.gid == current_puzzleID);

    try{
      // Replace the current time/#moves with the best time/#moves/solution status.
      // This is BUGGY since if play 3 times and
      // in game 1, we have the best time but worse in all other criteria,
      // in game 2, we have the best number of moves but worse in all other criteria,
      // in game 3, we find the perfect solution but worse in all other criteria
      // As a result of this process we have one database entry with the best numbers from these three games
      // THE GOAL is to keep one entry for each game in the database and simplify the statistic generation
      if (db_result.t < newItem.t ){
        newItem.t = db_result.t
      }
      if (db_result.m < newItem.m ){
        newItem.m = db_result.m
      }
      if (db_result.st ){
        newItem.st = db_result.st
      }
      user_game_results[resultIndex] = newItem
    }catch (error) {
      // add the item
      user_game_results.push(newItem)
    }

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

function current_dayofyear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day
}

function current_year() {
  var year = new Date().getFullYear();
  return year
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
    } else if (current_level > 2020 &&  current_level < 2050) {
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
  console.log("load_user_data")
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
function open_url(level, gid){
  console.log("loading puzzle", level, gid)
  loadGame(level, gid)
  homepuzzle()
}

function loadingStatistic(){
  setTimeout(() => load_user_data(), 300)
  setTimeout(() => statisticUI(), 600)
}

function secondToStr(input_second){
  var minutes = ("0" +Math.floor(input_second/ 60)).slice(-2) ;
  var seconds = ("0" + (input_second - minutes * 60)).slice(-2);
  return minutes + ":" + seconds ;
  
}
function statisticUI(){
  console.log("statisticUI");
  e = document.getElementById("statistic");
  e.innerHTML =''
  levels= [2028,2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  for(puzzle_inx in levels){
    level= levels[puzzle_inx]
    if (user_game_results.find(element => element.l == level) !=undefined  ){
      console.log("level exist", level);
      filtered_items= user_game_results.filter(element => element.l == level)
      filtered_items_len= filtered_items.length
      filtered_items_avg_moves = (filtered_items.reduce( (accumulator, currentValue)  => accumulator + currentValue.m, 0 ) / filtered_items_len )
      filtered_items_avg_time = (filtered_items.reduce( (accumulator, currentValue)  => accumulator + currentValue.t, 0 ) /  filtered_items_len )
      if (level  < 2100 && level > 2000){
        level_format = "🗓️ Year "
      } else{
        level_format = "🌡️ Difficulty Level "
      }
      filtered_items_avg_time = secondToStr(parseInt(filtered_items_avg_time))
      filtered_items_avg_moves = parseInt(filtered_items_avg_moves)
      e.innerHTML += `<div class="accordion-container"> <button class="accordion"><b>${level_format} ${level}</b> <br>Solved puzzles:${filtered_items_len} | Avg Time: ${filtered_items_avg_time} | Avg Moves:${filtered_items_avg_moves} </button> <div class="panel" id="level${level}"></div> </div>`;
      for(game_inx in filtered_items){
        game_info = filtered_items[game_inx]
        el = document.getElementById(`level${level}`);
        var date = new Date(game_info.ts);
        date_format= date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
        human_time = secondToStr(game_info.t)
        if (game_info.st){
          perfect_format = "✅"
        }else{
          perfect_format = "☑️"
        }
        el.innerHTML += `<p>${date_format} <a onclick="javascript:open_url(${level}, ${game_info.gid})" href="/#gid=${game_info.gid}&amp;d=${level}&amp;">Puzzle ID ${game_info.gid}</a> &nbsp; Time: ${human_time} &nbsp; Moves:${game_info.m}  ${perfect_format}</p>`
      }
    }
  }


  console.log("statisticUI > user_game_results:", user_game_results)

  $(".accordion").on("click", function() {
    $(this).toggleClass("active");
    $(this).next().slideToggle(200);
  });
}
