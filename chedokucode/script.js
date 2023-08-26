
function adjustSlider() {
  $(function () {
    $("#slider-range-min").slider({
      range: "min",
      value: current_level,
      min: 1,
      max: 20,
      slide: function (event, ui) {
        $("#level").val(ui.value);
        current_level = ui.value
        current_puzzleID = defaultPuzzleID
        loadAllPuzzles(current_level)
        cuteToast(type = "reset", message = '')
        loadGame(current_level, current_puzzleID)
      }
    });
  });
}

// github.io, or chedoku.com
function inApp(){
  if (window.location.href.toLowerCase().indexOf("chedoku") == -1 
  && window.location.href.toLowerCase().indexOf("github") == -1 
    ){
      return true
    }else{
      return false
    }
}

function ApplyAppModifications() {
  document.getElementsByClassName('popup-overlay')[0].remove()
  document.getElementById('item-blog').remove()
  document.getElementById('item-blog-side').remove()
  document.getElementById('item-login-side').remove()
  document.getElementById('item-login').remove()
  document.getElementById('item-download-side').remove()
  document.getElementById('item-download').remove()
  $('#footer').html("<b>Offline mode</b>: You are not connected to the internet, and your game progress will not be saved.  <button onclick=redirect_if_inapp_chedoku_reachable()>Click here to re-check connectivity</button> &nbsp; &nbsp; <a href=https://www.chedoku.com/privacy>Privacy Policy</a> ")
}

function redirect_if_inapp_chedoku_reachable() {
  if (inApp()) {
    // localhost, app
    console.log("chedokuApp: loading from localhost or the app, customization activated")
    document.addEventListener("DOMContentLoaded", (event) => {
      ApplyAppModifications()
    });
    // check if it is connected to internet
    console.log("chedokuApp: checking internet connectivity")
    let fetchRes = fetch(
      "https://chedoku.com/puzzles/list.json?" + Math.random().toString(36));
    fetchRes.then(res =>
      res.json()).then(d => {
        console.log("in app and connected to the internet" + d)
        if (d != null) {
          window.location.href = "https://www.chedoku.com/" + window.location.hash + "&#nopopup";
        }
      }
      ).catch(function (error) {
        console.log('error = ' + error)
      })
  }
}


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
      + ` &nbsp;
      <a href="http://www.facebook.com/share.php" id="notification-facebook" ><img src="static/social/fb.png" alt="Share this Chedoku on Facebook" border="0" rel="nofollow noopener"/></a>
      <a href="http://twitter.com/intent/tweet" id="notification-twitter" ><img src="static/social/twitter.png" alt="Tweet this Chedoku" border="0" rel="nofollow noopener" /></a>
      <b style="display:inline" id="cliboardinput"></b>
      <button style="display:inline;width: 20px;border: 0;" class="btn" onclick="copyContent()"><img src="static/clipboard.svg" border="0" /></button>
    `

    document.querySelector('#notification-facebook').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(socialmedia_url);
    document.querySelector('#notification-twitter').href = 'https://twitter.com/intent/tweet?text=' + socialmedia_text + encodeURIComponent(socialmedia_url);
    document.querySelector('#cliboardinput').text = socialmedia_text + socialmedia_url;

    $('#alert-notification').fadeIn(100);
  }
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

  if (! is_solution_is_pressed && solution) {
    if (foundStrictSolution) {
      msg = `Congratulations! You found the perfect solution ✅ in ${current_puzzle_moves} moves and ${durStr}. Share it with your friends by clicking here: `
      msgtype = "success"
      if (current_level > 2020 && current_level < 2050) {
        socialmedia_text = `I found the perfect solution ✅ for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found the perfect solution ✅ for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    } else {
      msg = `Congratulations! You found a valid solution in ${current_puzzle_moves} moves and ${durStr}. You can keep playing to find the perfect solution that has no additional threats on empty squares,   <a href="#Foo" onclick="rules(); return false;">Learn more about rules</a> .`
      msgtype = "warning"
      if (current_level > 2020 && current_level < 2050) {
        socialmedia_text = `I found a solution ☑️ for today's (${date}) Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}.  #chedoku #puzzle #chess Challenge yourself with today's puzzle here: `
        socialmedia_url = `https://chedoku.com/#dailypuzzle`
      } else {
        socialmedia_text = `I found a solution ☑️ for this Chedoku puzzle in ${current_puzzle_moves} moves and ${durStr}. #chedoku #puzzle #chess Challenge yourself with the same puzzle here: `
        socialmedia_url = `https://chedoku.com/#gid=${current_puzzleID}&d=${current_level}`
      }
    }

    cuteToast(type = msgtype, message = msg, socialmedia_url = socialmedia_url, socialmedia_text = socialmedia_text)
    // t: time to completion, m: number of moves, l: level, gid: puzzleid, ts: Timestamp, st: solution type
    newItem = { "t": parseInt(dur), "m": parseInt(current_puzzle_moves), 'l': parseInt(current_level), 'gid': parseInt(current_puzzleID), 'ts': Date.now(), 'st': foundStrictSolution }
    resultIndex = userGameResults.findIndex(element => element.l == current_level && element.gid == current_puzzleID);
    db_result = userGameResults[resultIndex]
    if (resultIndex != -1) {
      userGameResults[resultIndex] = betterResult(db_result, newItem)
      syncUserGameResults()
    } else {
      // add the item
      userGameResults.push(newItem)
      syncUserGameResults()
    }

    try {
      updateUserGameToServer();
      //loadingStatistic();
      //loadUserGameFromServer();
    }
    catch (e) {
      console.log("User is not logged in to save played games")
    }
  }
}


async function copyContent() {
  try {
    msg = document.querySelector('#cliboardinput').text
    await navigator.clipboard.writeText(msg);
    cuteToast(type = 'success', message = `<b>The following message is copied to the clipboard</b>:<br> "${msg}"`)
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
    if (currentShowHint) {
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
  if (currentDraggable) return
  square = this.dataset["square"] // $(this).data("square");
  console.log("clicked on " + square);

  if (square in board.position()) { // click on a piece 
    if (squareSource == null) {
      console.log("Source is selected");
      $(this).addClass('myhighlight');
      squareSource = square
    } else {
      console.log("Source is Changed");
      boardElement.find('.square-' + squareSource).removeClass('myhighlight');
      $(this).addClass('myhighlight');
      squareSource = square
    }
  } else if (squareSource != null && !(square in puzzleNumbers)) { // source is already clicked and a number is not clicked
    console.log("empty square, possible to move the piece = destination clicked")
    squareDestination = square
    board.move(squareSource + '-' + squareDestination)
    boardElement.find('.square-' + squareSource).removeClass('myhighlight');
    squareSource = null
    squareDestination = null
  }
}

function registerSquareOnClickHandler() {
  for (i in allSquares) {
    square = allSquares[i]
    //console.log(square)
    boardElement.find('.square-' + square).click(handler)
  }
}

function currentDayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day
}

function currentYear() {
  var year = new Date().getFullYear();
  return year
}

function reset() {
  // console.log("puzzlePieces", puzzlePieces)
  var cfg = {
    dropOffBoard: dropOffBoard,
    sparePieces: sparePieces,
    draggable: currentDraggable,
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

function baseUrl() {
  //window.location.href.split('?')[0]
  return window.location.origin + window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/'))
}

function loadAllPuzzles() {
  //console.log("loading level", current_level)
  let path = baseUrl()
  jsonUrl = path + '/puzzles/level' + current_level + '/list.json'
  $.getJSON(jsonUrl, function (data) {
    //console.log(data)
    allPuzzles = data['puzzles']
  });
}

function loadPuzzle(level, puzzleID) {
  is_solution_is_pressed = false
  let path = baseUrl()
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

    accountInfoUIrefresh()

    $('#infotextLevelSlider').html('Change difficulty level: <b> ' + current_level + '</b>');
    $('#infotextPuzzleID').html('Puzzle ID: <b> ' + puzzleID + '</b>');
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
    } else if (window.location.hash == 'download') {
      window.location.hash = 'download'
    } else if (window.location.hash == 'login') {
      window.location.hash = 'login'
    } else if (window.location.hash == 'dailypuzzle') {
      window.location.hash = 'dailypuzzle'
    } else if (current_level < 50) {
      updateHash(hashParams)
    } else if (current_level > 2020 && current_level < 2050) {
      window.location.hash = 'dailypuzzle'
    } else if (current_level == 999) {
      window.location.hash = 'tutorial'
    }

  }).fail(function () {
    console.log("ERROR loading puzzle")
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
  boardElement.find('.square-' + squareToHighlight).addClass('myhighlight')
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
  adjustSlider()
  if (level < 2000 & puzzleID > 30) {
    current_level = level + 1;
    current_puzzleID = 1;
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
  return (userGameResults.filter(x => x['level'] == lvl).map(x => x['gid']))
}

function syncUserGameResults() {
  // sync userGameResults variable with its key in localStorage 
  console.log("localStorageUpdate", userGameResults)
  window.localStorage.setItem('userGameResults', JSON.stringify(userGameResults));
}



// Replace the current time/#moves with the best time/#moves/solution status.
// This is BUGGY since if play 3 times and
// in game 1, we have the best time but worse in all other criteria,
// in game 2, we have the best number of moves but worse in all other criteria,
// in game 3, we find the perfect solution but worse in all other criteria
// As a result of this process we have one database entry with the best numbers from these three games
// THE GOAL is to keep one entry for each game in the database and simplify the statistic generation
function betterResult(old_game, new_game) {
  // only t, m and st properties are checked and all other info from recent game is used
  if (old_game.t < new_game.t) {
    new_game.t = old_game.t
  }
  if (old_game.m < new_game.m) {
    new_game.m = old_game.m
  }
  if (old_game.st) {
    new_game.st = old_game.st
  }
  return new_game
}

function mergeGameResults(old_results, new_results) {
  console.log(" MERGING", old_results, new_results)
  merged_results = old_results
  for (i in new_results) {
    new_game = new_results[i]
    old_game_index = old_results.findIndex(element => element.l == new_game.l && element.gid == new_game.gid) // find old game with the same level and gid
    if (old_game_index < 0) {
      console.log("adding a new game info", new_game)
      merged_results.push(new_game)
    } else {
      merged_results[old_game_index] = betterResult(old_results[old_game_index], new_game)
    }
  }
  return merged_results
}

function loadUserGameFromServer() {
  console.log("loadUserGameFromServer")
  try {
    database.ref().child('game_played/' + firebase.auth().currentUser.uid).once('value').then(function (lead) {
      //console.log(lead.val().userGameResults);
      serverUserGameResults = JSON.parse(lead.val());
      console.log("serverUserGameResults", serverUserGameResults.length)
      console.log("userGameResultsX", userGameResults.length)
      if (userGameResults.length > 0) {
        console.log("Merging")
        userGameResults = mergeGameResults(serverUserGameResults, userGameResults)
        updateUserGameToServer();
      } else {
        userGameResults = serverUserGameResults
      }


      userPuzzlesFromServer = true
      console.log("updated userGameResults:", userGameResults.length)
    });
  } catch (error) {
    //console.log(error)
    console.log("User is not logged in, cannot loadUserGameFromServer() ")
    userPuzzlesFromServer = false
  }

  //setTimeout(() => loadGame(current_level, current_puzzleID), 200)
  setTimeout(() => accountInfoUIrefresh(), 300)
}

function updateUserGameToServer() {
  // this will sync userGameResults with server
  // console.log(firebase.auth().currentUser.email)
  var database_ref = database.ref()
  user = firebase.auth().currentUser
  if (Object.keys(userGameResults).length > 0) {
    //console.log("JSON userGameResults", JSON.stringify(userGameResults))
    database_ref.child('game_played/' + user.uid).set(JSON.stringify(userGameResults))
  }
}
function openPuzzleUrl(level, gid) {
  console.log("loading puzzle", level, gid)
  loadGame(level, gid)
  homePuzzle()
}

function loadingStatistic() {
  setTimeout(() => loadUserGameFromServer(), 300)
  setTimeout(() => statisticUI(), 600)
}

function secondToStr(input_second) {
  var minutes = ("0" + Math.floor(input_second / 60)).slice(-2);
  var seconds = ("0" + (input_second - minutes * 60)).slice(-2);
  return minutes + ":" + seconds;
}
function statisticUI() {
  //console.log("statisticUI");
  e = document.getElementById("statistic");
  e.innerHTML = ''
  levels = [2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  for (puzzle_inx in levels) {
    level = levels[puzzle_inx]
    if (userGameResults.find(element => element.l == level) != undefined) {
      filtered_items = userGameResults.filter(element => element.l == level)
      filtered_items_len = filtered_items.length
      filtered_items_avg_moves = (filtered_items.reduce((accumulator, currentValue) => accumulator + currentValue.m, 0) / filtered_items_len)
      filtered_items_avg_time = (filtered_items.reduce((accumulator, currentValue) => accumulator + currentValue.t, 0) / filtered_items_len)
      if (level < 2100 && level > 2000) {
        level_format = "🗓️ Year "
      } else {
        level_format = "🌡️ Difficulty Level "
      }
      filtered_items_avg_time = secondToStr(parseInt(filtered_items_avg_time))
      filtered_items_avg_moves = parseInt(filtered_items_avg_moves)
      e.innerHTML += `<div class="accordion-container"> <button class="accordion"><b>${level_format} ${level}</b> <br>Solved puzzles:${filtered_items_len} | Avg Time: ${filtered_items_avg_time} | Avg Moves:${filtered_items_avg_moves} </button> <div class="panel" id="level${level}"></div> </div>`;
      for (game_inx in filtered_items) {
        game_info = filtered_items[game_inx]
        el = document.getElementById(`level${level}`);
        var date = new Date(game_info.ts);
        date_format = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
        human_time = secondToStr(game_info.t)
        if (game_info.st) {
          perfect_format = "✅"
        } else {
          perfect_format = "☑️"
        }
        el.innerHTML += `<p>${date_format} <a onclick="javascript:openPuzzleUrl(${level}, ${game_info.gid})" href="/#gid=${game_info.gid}&amp;d=${level}&amp;">Puzzle ID ${game_info.gid}</a> &nbsp; Time: ${human_time} &nbsp; Moves:${game_info.m}  ${perfect_format}</p>`
      }
    }
  }


  //console.log("statisticUI > userGameResults:", userGameResults)

  $(".accordion").on("click", function () {
    $(this).toggleClass("active");
    $(this).next().slideToggle(200);
  });
}



// https://kamranahmed.info/driver.js/

function square2element(square) {
  return document.querySelectorAll('.square-' + square)[0]
}

function isElementSquare(element, square) {
  return String(element.node.classList).includes(square)
}





function driverjs_1() {
  const driver = new Driver({
    onNext: (Element) => {
      if (isElementSquare(Element, "b2")) {
        board.move('a1-b4')
      }
      if (isElementSquare(Element, "h5")) {
        board.move('b4-g4')
      }
      if (isElementSquare(Element, "g4")) {
        board.position('2p1b3/8/8/8/8/8/8/8 w - - 0 1')
      }
    }, onReset: (Element) => {
      // current_level = defaultLevel
      // current_puzzleID = defaultPuzzleID
      // loadAllPuzzles(current_level)
      // console.log("change current_level", current_level ) ;
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





function loadTutorials() {
  allPuzzles = [1, 2, 3, 4]
  current_level = 999
  console.log("change current_level", current_level);
  loadGame(current_level, 1)
  // Start the introduction
  setTimeout(() => driverjs_1(), 500);
}

function disableAllComponents() {
  document.getElementById("board").style.display = "none";
  document.getElementById("puzzleLevelSelector").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("boardcontrol").style.display = "none";
  document.getElementById("about").style.display = "none";
  //document.getElementById("mailist").style.display = "none";
  document.getElementById("footer").style.display = "none";
  document.getElementById("rules").style.display = "none";
  document.getElementById("download").style.display = "none";
}

function currentDate() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  return today.toDateString();
}
function homePuzzle(nextActive = true) {

  loadAllPuzzles(current_level)
  loadUserGameFromServer()
  disableAllComponents();
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

function accountInfoUIrefresh() {
  prevPuzzleInfo = ''
  loggedInText = 'You are not logged in.'
  if (userPuzzlesFromServer) {
    loggedInText = 'You are logged in.'
    for (i in userGameResults) {
      game_info = userGameResults[i]
      if (game_info.l == current_level && game_info.gid == current_puzzleID) {
        human_time = secondToStr(game_info.t)
        if (game_info.st) {
          perfect_format = "✅"
        } else {
          perfect_format = "☑️"
        }
        prevPuzzleInfo = `<br>Record time: ${human_time} ${perfect_format} Record moves: ${game_info.m}`
      }
    }
  } else {
    if (userGameResults.length > 0) {
      loggedInText = 'You are not logged in.  <span class="red-bubble" onclick="javascript:login()"  >' +  userGameResults.length + ' unsaved puzzles</span>'
    }
    $('#statistic').html("");
  }
  $('#infotextAccount').html(loggedInText + prevPuzzleInfo);
}

function daily() {
  current_level = currentYear();
  current_puzzleID = currentDayOfYear()
  homePuzzle(nextActive = false)

  $('#infodate').html("<p>Daily puzzle of " + currentDate() + "</p>");
  window.location.hash = 'dailypuzzle'
}

function tutorial() {
  disableAllComponents();
  document.getElementById("board").style.display = "block";
  document.getElementById("puzzleLevelSelector").style.display = "block";
  document.getElementById("boardcontrol").style.display = "block";
  loadTutorials();
  window.location.hash = 'tutorial'
}

function download() {
  disableAllComponents();
  document.getElementById("download").style.display = "block";
  window.location.hash = 'download'
}


function login() {
  disableAllComponents();
  document.getElementById("login").style.display = "block";
  window.location.hash = 'login'
  loadingStatistic()
}

function loadScript(url) {
	return new Promise(function(resolve, reject) {
		let script = document.createElement('script');
		script.src = url;
		script.async = false;
		script.onload = function() {
			resolve(url);
		};
		script.onerror = function() {
			reject(url);
		};
		document.body.appendChild(script);
	});
}

function firebase() {
    console.log("Firebase")
    let scripts = [
      'static/js-css-lib/firebasejs/9.13.0/firebase-app-compat.js',
      'static/js-css-lib/firebasejs/9.13.0/firebase-auth-compat.js',
      'static/js-css-lib/firebasejs/9.13.0/firebase-database-compat.js',
      'firebase/config.js',
      'firebase/common.js',
      'firebase/dist/firebaseui.js',
      'firebase/app.js'
    ];
    // save all Promises as array
    let promises = [];
    scripts.forEach(function(url) {
      promises.push(loadScript(url));
    });
    Promise.all(promises)
    .then(function() {
      console.log('all scripts loaded');
      firebase_loaded= true
    }).catch(function(script) {
      console.log(script + ' failed to load');
    });
}

function rules() {
  disableAllComponents();
  document.getElementById("rules").style.display = "block";
  window.location.hash = 'rules'
}
function about() {
  disableAllComponents();
  document.getElementById("about").style.display = "block";
  window.location.hash = 'about'
}
function blog() {
  window.location.href = "/blog";
}
function subscription() {
  disableAllComponents();
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
  /*
  document.getElementById('item-mailist').onclick = function (e) {
    subscription()
  }
  document.getElementById('item-mailist-side').onclick = function (e) {
    subscription()
  }
  */
  document.getElementById('item-home').onclick = function (e) {
    current_level = defaultLevel;
    current_puzzleID = defaultPuzzleID;
    homePuzzle()
  }
  document.getElementById('item-home-side').onclick = function (e) {
    current_level = defaultLevel;
    current_puzzleID = defaultPuzzleID;
    homePuzzle()
  }
  document.getElementById('item-daily').onclick = function (e) {
    daily()
  }
  document.getElementById('item-daily-side').onclick = function (e) {
    daily()
  }
  // ABOUT
  document.getElementById('item-info').onclick = function (e) {
    about()
  }
  document.getElementById('item-info-side').onclick = function (e) {
    about()
  }
  // DOWNLOAD
  document.getElementById('item-download').onclick = function (e) {
    download()
  }
  document.getElementById('item-download-side').onclick = function (e) {
    download()
  }
  // RULES
  document.getElementById('item-rules').onclick = function (e) {
    rules()
  }
  document.getElementById('item-rules-side').onclick = function (e) {
    rules()
  }
  // LOGIN
  document.getElementById('item-login').onclick = function (e) {
    login()
  }
  document.getElementById('item-login-side').onclick = function (e) {
    login()
  }

  // blog
  document.getElementById('item-blog').onclick = function (e) {
    blog()
  }
  document.getElementById('item-blog-side').onclick = function (e) {
    blog()
  }

  // TUTORIAL IS BASICALLY HOME
  document.getElementById('item-tutorial').onclick = function (e) {
    tutorial()
  }
  document.getElementById('item-tutorial-side').onclick = function (e) {
    tutorial()
  }
})();