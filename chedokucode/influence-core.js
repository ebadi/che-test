// Chess "threat" influence engine: for a given FEN, counts how many pieces of
// each side threaten every square. This is the computational core of
// influence() in script.js, pulled out into its own file so it can be unit
// tested outside the browser (see chedokucode/tests/influence.test.js) and so
// the performance-critical part is isolated from DOM/jQuery code.
//
// Loaded as a plain <script> after chess.js and before script.js, so it reads
// the same globals script.js does (`Chess`, `allSquares`); in Node it's
// required as a CommonJS module with those set as globals instead (see the
// test file for how).
(function (root) {

  // Finds the square holding the first piece of `pieceType`/`colour` on `chess`.
  function squaresOfPieceOnBoard(chess, colour, pieceType) {
    return allSquares.find(square => {
      const r = chess.get(square);
      return r === null ? false : (r.color == colour && r.type.toLowerCase() === pieceType);
    });
  }

  // Finds the square holding the first piece of `pieceType`/`colour` in `fen`.
  function squaresOfPiece(fen, colour, pieceType) {
    return squaresOfPieceOnBoard(new Chess(fen), colour, pieceType);
  }

  // Flips a FEN's side-to-move, used to evaluate threats from either color's perspective.
  function fenForOtherSide(fen) {
    return (fen.search(" w ") > 0) ?
      fen.replace(/ w .*/, " b - - 0 1") :
      fen.replace(/ b .*/, " w - - 0 2");
  }

  // Counts, for every square, how many pieces of `fen`'s side to move could
  // capture there — i.e. one call replaces 64 calls to the original
  // per-square countSquareDefenders(fen, square).
  //
  // Two redundant costs made the original slow, both eliminated here without
  // changing what gets counted:
  //
  // 1. It built a brand new Chess object from `fen` AND re-scanned the whole
  //    board for the opposing queen separately for every one of the 64
  //    squares (128 times per influence() call), even though both only
  //    depend on `fen`, not on which square is being tested. This computes
  //    them once and reuses a single Chess object for all 64 squares, undoing
  //    each square's edits (remove phantom piece, restore whatever was really
  //    there) before moving to the next, so every square still sees the same
  //    starting position the original freshly built for it.
  //
  // 2. For each of those 64 squares it asked chess.js to generate *every*
  //    piece's moves (`chess.moves({legal:false, verbose:true})` with no
  //    square filter) just to keep the ones landing on that one square — a
  //    full-board move generation, 64 times over. chess.js's own per-square
  //    query (`chess.moves({square: s, ...})`) generates only that one
  //    piece's moves and is an order of magnitude cheaper, so instead this
  //    queries only the actual attacking pieces on the board (rarely more
  //    than a handful in these puzzles) and keeps the ones landing on the
  //    target square — the same moves the full-board query would have
  //    produced, just without generating (and discarding) every other
  //    piece's moves 64 times over.
  function countThreatsOnEverySquare(fen) {
    const chess = new Chess(fenForOtherSide(fen));
    const attackerColor = chess.turn()
    const oppositeColor = attackerColor == 'w' ? 'b' : 'w'
    const queenSquare = squaresOfPieceOnBoard(chess, oppositeColor, 'q');
    chess.remove(queenSquare); // remove his queen (no-op if there is none); stays removed for every square below, same as the original removing it fresh each time

    // Squares of the attacking side's own pieces, other than the queen just
    // removed above. Stable across all 64 squares below — only each square's
    // own (possibly attacker-owned) piece is temporarily removed in turn.
    const attackerSquares = allSquares.filter(sq => {
      const p = chess.get(sq)
      return p !== null && p.color === attackerColor
    })

    return allSquares.map(square => {
      const somePiece = chess.remove(square); // remove my piece if any
      chess.put({ // put queen in the square
        type: 'p',
        color: oppositeColor
      }, square);

      let defendersCount = 0
      for (const pieceSquare of attackerSquares) {
        if (pieceSquare === square) continue // this piece was just removed above, to make room for the phantom
        const moves = chess.moves({ square: pieceSquare, verbose: true, legal: false, promotion: 'q' })
        // A flags value of 'cp' means a pawn captured a piece on the 8th rank and
        // promoted; 4 promotions are possible there but we only count promotion to queen.
        defendersCount += moves.filter(m => m.to == square && (m.flags == 'c' || (m.flags == 'cp' && m.promotion == 'q'))).length
      }
      if (somePiece && somePiece.color != oppositeColor) // count our own piece as controlling that square
        defendersCount += 1

      // Undo this square's edits so the next square starts from the same
      // position the original would have freshly built for it.
      chess.remove(square)
      if (somePiece) chess.put(somePiece, square)

      return defendersCount
    })
  }

  // For every square: (pieces of the side to move threatening it) minus
  // (pieces of the other side threatening it).
  function computeInfluenceValues(fen) {
    const defenders = countThreatsOnEverySquare(fen)
    const attackers = countThreatsOnEverySquare(fenForOtherSide(fen))
    return allSquares.map((s, i) => defenders[i] - attackers[i])
  }

  const api = { fenForOtherSide, squaresOfPiece, computeInfluenceValues };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    Object.assign(root, api);
  }

})(typeof window !== 'undefined' ? window : globalThis);
