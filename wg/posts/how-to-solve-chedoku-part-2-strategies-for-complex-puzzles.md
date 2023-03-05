Simple Chedoku puzzles are [great for learning how chess pieces move]. But as the puzzles get more complex, other strategies are needed to solve them. Similar to other puzzle games like wordle, I implemented a [daily puzzle](https://chedoku.com/#dailypuzzle) on my website, where you can challenge yourself.

The game is a good exercise to improve your understanding of chess piece movements and your chess board vision – the difference to regular chess puzzles is that you are reverse-engineering a chess position from the threat patterns, instead of analyzing the threat patterns based on a given position.

In addition to the simple visual pattern recognition [from my previous post](https://chedoku.com/blog), I find myself using a mix of the following strategies for most puzzles.

**Aim high**: In puzzles with a few higher numbers, I often try to solve those fields first before figuring out the smaller numbers.

**Limited options**: Sometimes, other pieces or other fields with numbers block the way, so that not all remaining pieces can still threaten the field you are trying to solve. Often, this can become clear after you have placed some pieces that have obvious visual patterns, and you are filling up the gaps next. One example of this can be a number that only one of your remaining unplaced figures can reach – such as a blocked off corner only a knight can threaten. Another example can be a too high threat – such as the queen threatening fields diagonally in addition to the otherwise similar pattern of a rook, giving you a hint which one of the two goes where.

**Blocking**: If your placement of pieces creates a too high threat number, you can sometimes block the threat with other pieces. Often pawns can be useful for this, since they have a very limited threat pattern and thus fewer unintended consequences when used as a blocking piece.

**Hiding**: In some of the more complex games, some pieces remain without directly threatening any other square. If a queen, rook, or bishop are on the board, but their distinctive threat patterns are not visible, they may be surrounded by other pieces. Similarly, a leftover pawn can be hidden in the last rank where it does not have any effect.

**Avoiding overkill**: Although you can to some extend block or hide figures, if your placement threatens too many empty squares, it can be a sign that there is something wrong. This is especially important when you are trying to find a [perfect solution] where you do not threaten any additional squares other than the numbered ones.

**Neutralizing**: When you play games with black pieces on the board, a trail of negative numbers usually reveals their position. However, if there are no negative numbers at all, the effect of the threat by black pieces might be neutralized by white pieces. For example, a black and white bishop in opposite corners of the board will neutralize each other.

On most days, you can watch me play the [daily puzzle](https://chedoku.com/#dailypuzzle) on or if you want to compare your solving strategies to mine 🙂

[Watch Nelson from “Chess Vibes” play and explain the game](https://www.youtube.com/watch?v=KC3UaQqMjdI)

Do you have any ideas for other strategies, or implementing an algorithm for finding the solutions? I would love to hear from you!