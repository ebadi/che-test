// Regression test for the chess "threat" influence engine (see
// chedokucode/influence-core.js). Compares the production computeInfluenceValues()
// against `referenceComputeInfluenceValues()` below, which is a verbatim copy of the
// original, unoptimized algorithm that shipped before the performance work. If they
// ever disagree, the optimization changed behavior.
//
// Run with: node chedokucode/tests/influence.test.js
'use strict';

const path = require('path');
const { Chess } = require(path.join(__dirname, '../../static/js-css-lib/chess.min.js'));

global.Chess = Chess;
global.allSquares = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8'];
const allSquares = global.allSquares;

const { computeInfluenceValues } = require(path.join(__dirname, '../influence-core.js'));

/* ---------- reference implementation (pre-optimization, kept verbatim for comparison) ---------- */

function referenceFenForOtherSide(fen) {
  return (fen.search(" w ") > 0) ?
    fen.replace(/ w .*/, " b - - 0 1") :
    fen.replace(/ b .*/, " w - - 0 2");
}

function referenceSquaresOfPiece(fen, colour, pieceType) {
  const chess = new Chess(fen);
  return allSquares.find(square => {
    const r = chess.get(square);
    return r === null ? false : (r.color == colour && r.type.toLowerCase() === pieceType);
  });
}

function referenceCountSquareDefenders(fen, square) {
  const chess = new Chess(referenceFenForOtherSide(fen));
  const oppositeColor = chess.turn() == 'w' ? 'b' : 'w'

  const queenSquare = referenceSquaresOfPiece(fen, oppositeColor, 'q');
  const somePiece = chess.remove(square);
  chess.remove(queenSquare);
  chess.put({ type: 'p', color: oppositeColor }, square);

  const moves = chess.moves({ verbose: true, legal: false, promotion: 'q' })
  let defendersCount = moves.filter(m => m.to == square && (m.flags == 'c' || (m.flags == 'cp' && m.promotion == 'q'))).length
  if (somePiece && somePiece.color != oppositeColor)
    defendersCount = parseInt(defendersCount) + 1

  return defendersCount
}

function referenceComputeInfluenceValues(fen) {
  const defenders = allSquares.map(s => referenceCountSquareDefenders(fen, s))
  const attackers = allSquares.map(s => referenceCountSquareDefenders(referenceFenForOtherSide(fen), s))
  return allSquares.map((s, i) => defenders[i] - attackers[i])
}

/* ---------- 20 diverse test positions ---------- */
// Chedoku puzzles are usually sparse (few pieces, often no kings at all — see
// puzzles/level1/1.json), so most cases below mirror that, plus a few dense/standard
// positions to stress sliding-piece move generation.

const cases = [
  { name: '01 standard starting position', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1' },
  { name: '02 two kings only, white to move', fen: '8/8/8/4k3/4K3/8/8/8 w - - 0 1' },
  { name: '03 single white rook, center (real puzzle shape)', fen: '8/8/8/3R4/8/8/8/8 w - - 0 1' },
  { name: '04 single black knight, corner a1, black to move', fen: 'n7/8/8/8/8/8/8/8 b - - 0 1' },
  { name: '05 single white queen, center, black to move', fen: '8/8/8/3Q4/8/8/8/8 b - - 0 1' },
  { name: '06 opposing queens, white to move', fen: '7q/8/8/8/8/8/8/Q7 w - - 0 1' },
  { name: '07 white pawns, starting rank only', fen: '8/8/8/8/8/8/PPPPPPPP/8 w - - 0 1' },
  { name: '08 black pawns, starting rank only, black to move', fen: '8/pppppppp/8/8/8/8/8/8 b - - 0 1' },
  { name: '09 white pawn one step from promotion', fen: '8/4P3/8/8/8/8/8/8 w - - 0 1' },
  { name: '10 black pawn one step from promotion, black to move', fen: '8/8/8/8/8/8/4p3/8 b - - 0 1' },
  { name: '11 sparse mixed pieces, no kings/queens', fen: '8/2n5/8/3P4/8/5b2/8/8 w - - 0 1' },
  { name: '12 mid-opening position with both kings', fen: 'r1bqk2r/pp1nbppp/2p1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R1BQK2R w KQkq - 0 8' },
  { name: '13 single knight, no queens on board', fen: '8/8/8/3n4/8/8/8/8 w - - 0 1' },
  { name: '14 single black queen, no white queen, white to move', fen: '8/8/8/3q4/8/8/8/8 w - - 0 1' },
  { name: '15 four minor pieces in the corners', fen: 'n6b/8/8/8/8/8/8/B6N w - - 0 1' },
  { name: '16 black bishop and knight, black to move', fen: '8/8/8/8/3b4/4n3/8/8 b - - 0 1' },
  { name: '17 lone black king vs white rook', fen: '8/8/8/8/4k3/8/8/R7 w - - 0 1' },
  { name: '18 white king vs black queen, black to move', fen: '4K3/8/8/8/8/8/8/6q1 b - - 0 1' },
  { name: '19 dense packed-center middlegame position', fen: 'rnbqkbnr/pp3ppp/2p5/3pp3/3PP3/2P5/PP3PPP/RNBQKBNR w KQkq - 0 5' },
  { name: '20 black pawn on b-file, edge-of-board diagonal captures', fen: '8/8/8/8/8/1p6/8/8 b - - 0 1' },
];

if (cases.length !== 20) {
  throw new Error(`Expected exactly 20 test cases, found ${cases.length}`);
}

/* ---------- run ---------- */

let failures = 0;
for (const { name, fen } of cases) {
  const expected = referenceComputeInfluenceValues(fen);
  const actual = computeInfluenceValues(fen);

  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures++;
    console.log(`FAIL: ${name}`);
    console.log(`  fen:      ${fen}`);
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  actual:   ${JSON.stringify(actual)}`);
    allSquares.forEach((sq, i) => {
      if (expected[i] !== actual[i]) {
        console.log(`  mismatch at ${sq}: expected ${expected[i]}, got ${actual[i]}`);
      }
    });
  } else {
    console.log(`PASS: ${name}`);
  }
}

console.log(`\n${cases.length - failures}/${cases.length} passed`);

/* ---------- performance comparison (informational, not a pass/fail check) ---------- */

const perfFen = cases[cases.length - 2].fen; // dense middlegame position
const iterations = 200;

let t0 = process.hrtime.bigint();
for (let i = 0; i < iterations; i++) referenceComputeInfluenceValues(perfFen);
let t1 = process.hrtime.bigint();
for (let i = 0; i < iterations; i++) computeInfluenceValues(perfFen);
let t2 = process.hrtime.bigint();

const originalMs = Number(t1 - t0) / 1e6;
const optimizedMs = Number(t2 - t1) / 1e6;
console.log(`\nPerf (${iterations} calls on a dense position):`);
console.log(`  original:  ${originalMs.toFixed(1)}ms`);
console.log(`  optimized: ${optimizedMs.toFixed(1)}ms`);
console.log(`  speedup:   ${(originalMs / optimizedMs).toFixed(2)}x`);

process.exit(failures === 0 ? 0 : 1);
