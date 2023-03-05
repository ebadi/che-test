Recently, **[I created Chedoku](https://www.chedoku.com)**, a single-player puzzle game that is a mix of chess, sudoku, and minesweeper. After inventing the puzzle, I started wondering about algorithms for solving it. When I solve the puzzles myself, the first and simplest strategy I use is to look for obvious visual patterns. The different ways that chess pieces can threaten another field on the board create distinctive patterns in the game.
For example, the rook has a vertical and horizontal pattern that looks like a cross.

![How to solve Chedoku puzzle game, Learning chess threat patterns, rook](https://www.chedoku.com/static/rules/rook.png)

The bishop has a diagonal pattern that looks like an X.

![How to solve Chedoku puzzle game, Learning chess threat patterns, bishop](https://www.chedoku.com/static/rules/bishop.png)

Queens have a combination of both rook and bishop, creating a dense pattern that attacks at many fields in the board.

![How to solve Chedoku puzzle game, Learning chess threat patterns, Queens](https://www.chedoku.com/static/rules/queen.png)

A king has a square-shaped pattern.

![How to solve Chedoku puzzle game, Learning chess threat patterns, King](https://www.chedoku.com/static/rules/king.png)

A knight creates a semi-circular pattern.

![How to solve Chedoku puzzle game, Learning chess threat patterns, g](https://www.chedoku.com/static/rules/knight.png)

And pawns threaten the two tiles diagonally in front of them.

![How to solve Chedoku puzzle game, Learning chess threat patterns, pawns](https://www.chedoku.com/static/rules/pawn.png)

Of course, the patterns can be cut off when a piece is placed in the edges or corners of the board or a corner.

![How to solve Chedoku puzzle game, Learning chess threat patterns, pawn cutoff](https://www.chedoku.com/static/rules/pawn-cutoff.png)

In more complex puzzles, patterns can also be blocked by other pieces.

![How to solve Chedoku puzzle game, Learning chess threat patterns, pawn cutoff](https://www.chedoku.com/static/rules/queen-blocked.png)

When black pieces occur in the game, they create negative numbers. By themselves, these also create distinctive visual patterns.

![How to solve Chedoku puzzle game, Learning chess threat patterns, pawn cutoff](https://www.chedoku.com/static/rules/black-effect.png)

But when combining white and black pieces, the numbers can cancel each other out, creating empty squares that disrupt the patterns.

![How to solve Chedoku puzzle game, Learning chess threat patterns, pawn cutoff](https://www.chedoku.com/static/rules/black-white.png)


If you are still learning how chess pieces move, I recommend that you start with [level 1 Chedoku puzzles](https://www.chedoku.com/#gid=1&d=1&). This will help you recognize the typical patterns more quickly. If you already know the basic movements of chess figures, I suggest starting with [level 3 Chedoku puzzles](https://www.chedoku.com/#gid=1&d=3&) and then adjusting the difficulty to find the level that is right for you!

