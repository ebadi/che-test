# This project has a strict license. Please contact the author for permission.

## TODO

```
    ////////////////////// TODO  //////////////////////
    ////////////////////////////////////////////
    // https://github.com/jhlywa/chess.js/issues/186
    // https://jsfiddle.net/m5q6fgtb/859/

    // 3- Not correctly updated when a piece is added or removed : I guess FIXED
    // 4- Partial coloring of the red number. Increment in number, makes it more red: FIXED
    // 5- Solution for several puzzles are incomplete (e.g. 4) : FIXED
    // 6. Implement strict solutions for the puzzle : FIXED
    // 8. Not allowing pieces to be trashed : FIXED
    // 9. Relative urls: FIXED
    // 10. Toast appears twice. : FIXED
    // 11. After solving the puzzle, moving pieces around keep the state of the puzzle as solved. : FIXED
    // 16. image in the toast message is broken  : FIXED
    // 14. pawns do not threated the last row : FIXED
    // 2- double king causes the app crashes : NOT GOING TO BE FIXED
    // 7. Different levels of hint.: NOT GOING TO BE FIXED
    // 20. Mail collection service : FIXED
    // 12. better puzzle navigation with different levels of difficulties (continue by writing the number) : FIXED
    // 16. firebase database: FIXED
    // 16. Fix authentication: FIXED
    // 17. Collect time and number of moves and solved puzzles: FIXED
    // 21. Better UI, make authentication part sliding open:  FIXED
    // 23. randomizePieces: FIXED
    // 26. rules and about as overlay : FIXED
    // 29. Stop window scrolling on touch devices when moving a piece : FIXED https://github.com/oakmac/chessboardjs/pull/150  : FIXED
    // 27. On the first page visit, show "how to play" overlay + login option (e.g. https://www.nytimes.com/games/wordle/index.html) : FIXED
    // 13, new puzzles : FIXED
    // 30. Better credit page : FIXED
    // 32. puzzleid in url : FIXED
    // 22. Fix keyboard shortcuts : FIXED 
    // 34. Removing pieces from board doesn't update the big numbers color : FIXED
    // 33. Chess rules and clarify pawn threat, Clarify that pieces can be in any arbitrary place: FIXED
    // 32. Example puzzle in rules : FIXED
    // 36. Google analytics : FIXED 
    // 34. buy a domain and connect it to github pages ; FIXED
    // 40. Fix chess board responsiveness  https://www.chessboardjs.com/examples#3007 : FIXED
    // 39. Extra element on the end of the body appearing <img src="img/chesspieces/wikipedia/wP.png" id="bfec-f815-731e-b400-0fe0-74fa-b95b-199f" alt="" class="piece-417db" data-piece="wP" style="width: 49px; height: 49px; display: none;">  : LOW PRIORITY
    // 35. Allow clicking source and destination to move piece:  https://github.com/oakmac/chessboardjs/pull/138  :  FIXED
    // 30. Add more puzzles : FIXED
    // 38. Disable scroll left/right : FIXED
    // 43. Time millisecond to human readable : FIXED
    // 42. python script for puzzle generation : FIXED
    // 32. Twitter authentication: : FIXED
    // 43. Basic SEO : FIXED
    // 44. First post on reddit : FIXED
    // 50. Lazy image loading : FIXED
    // 47. Remove switch and keep only ON and OFF image : FIXED
    // 46. Adjustable puzzle difficulty (# of pieces, strict mode and mono/bi color), different difficulty in different json files : FIXED
    // 52. Black pieces are not counted in the puzzleMaker.py: FIXED

    // 48. Fix button spacing: FIXED 
    // 51. Explain the benefits of registering :FIXED
    // 58. The color numbers are not adjusted on init (all red) https://www.chedoku.com/#gid=23&d=5& : FIXED
    // 47. PERFORMANCE: Double click on next before the previous puzzle is loaded, causes the browser not to be responsive : FIXED, NEEDED 
    // 59. tutorial interaction with user and new user interface : FIXED
    // 61. investigate https://www.seoptimer.com/www.chedoku.com
    // 45. interactive tutorial or walk-through, threat number in solution ->> Click on tutorial loads a new game list -: FIXED
    // 65. http://www.chedoku.com/#gid=27&d=3& has only one piece to move but two areas that need solving.   ---> REMOVED, FIXED in Python puzzle generator
    // 61. Strange solution !!! http://0.0.0.0:8000/#gid=25&d=10&   !!!!!!!  FIXED
    // 64. After the tutorial, reset the puzzle list.
    // 56. puzzles with two kings are not handled correctly : FIXED in puzzled generator
    // 66. Margin issue on mobile, in rules 
    // 69. review tutorial :  FIXED
    // 70. tutorial not offload the puzzle list :  FIXED
    // 73. Difficulty as number :  FIXED
    // 73. Click and move  :  FIXED
    // 74. Click and move not moving to large number squares :  FIXED
    // 75. Switch between drag and click&move :  FIXED
    // 76. Auto detect the device and switch between them : FIXED 
    // 80. Making mode of move stable when puzzles change : FIXED
    // 78. button on mobile on load --> drag  but the mode is click   : FIXED
    // 79. Drag/click to tutorial  : FIXED
    // 80. Improve the build : FIXED
    // 77. Puzzle of the day, random puzzle, tutorial : FIXED
    // 73. Click release the piece and pick the other piece : FIXED

    // LOW PRIORITY, 
    // 74. puzzle of the day on homepage: FIXED, simple puzzle on homepage instead
    // 41. Daily puzzle and mailing list : FIXED
    // 37. termly.io  Privacy policy : FIXED, other alternative is used
    // 73. Option to remove the numerical hint, printer friendly : FIXED 
    // 83. Many issues with level 1 puzzles
    // 72. Replace https://www.chedoku.com/#gid=5&d=5&
    // 81. Guided mode / annual mode with black  appear and disappear
    // 58. Routine to handle when all puzzle for a level is solved : FIXED, RESET TO ONE, SHOULD BE TESTED
    // 87. UI improvement https://chess.stackexchange.com/questions/17334/arena-how-do-i-turn-off-highlighting-of-occupied-squares-under-attack
    // 83. Share via twitter & facebook buttons : FIXED
    // 66. Iphone drag issue https://stackoverflow.com/questions/4389932/how-do-you-disable-viewport-zooming-on-mobile-safari : FIXED
    // 83. Bold numbers: FIXED
    // 84. Remove date after solving the puzzle for the day. : FIXED
    // 54. Fix puzzle naming (random str instead of number) : REJECT
    // 87. Improve ABOUT page : FIXED
    // 92. Link to daily puzzle on homepage : FIXED
    // 100. UI improve, merge ABOUT / RULES : FIXED
    // 101. puzzle subscription goes beyond the page border : FIXED, Newsletter
    // 102. Popup margin/padding : BETTER NOW
    // 68. Clicking on solution should not show notification alert  : FIXED
    // 93. Link to chedoku.wordpress.com : FIXED
    // 94. Content content content, youtube, twitter, reddit : FIXED
    // 91. blog, content  : DONE 
    // 96. Next button is over stretched. problem is probably in inline-block for .material-icons or .stylish or $('#next').on .... : FIXED
    // 97. Pupup to make the user select  : FIXED
    // 67. Remove the black number when the number is green : FIXED
    // 102. regenerate daily puzzle, only white pieces
    // 112. Logo  and hamburger menu is pushed up   <---- BOOTSTRAP CSS causes this : FIXED
    // 113. After solving daily puzzle, no notification is shown until you go to home page : FIXED
    //114. Closing notification causes problem : FIXED
    //107. The user find the perfect solution: a box notification appears on top "Text1" , with 1 buttons. action one Share to social media  with "TextSocial1" : FIXED
    //109. Clean up the rule section : FIXED
    //108. share button to social media : FIXED
    //111. Human readable time second -> minutes hours : FIXED
    // 54. User -> levels -> puzzles in firebase and js (userGameResults) : FIXED, NEED MORE TESTING
    //106. Notification that stays there.  FIXED
    //117. New puzzle should reset notification
    //120. Share to social media should have a date and chedoku included : FIXED
    //121. I want to be able to share to telegram 😁 (also, the sharing message should probably say chedoku and/or chess puzzle somewhere): FIXED
    //122. The "learn more" link in the imperfect solution notification is not working (changes the URL in the address bar to the tutorial link, but doesn't change the page to go to FAQs) : FIXED
    //119. I think the only real issue is the not working 'learn more' link in the imperfect solution message (it seems to change the URL in the address bar, but the page doesn't change) : FIXED 
    //117. NEXT moves the puzzles up and down for no reason (notification displayed, hide) :FIXED
    //115. Direct link to about page : FIXED
    //116. Popup page should have an logo : FIXED
    //124. but wrong message... not a perfect solution it's a yellow notification, so should not have that anyways ... : FIXED
    //124. Google analytics privacy  warning GDPR on popup: FIXED
    //125. Remove tools from public github.io: FIXED
    //126. Find the callback fir firebase authentication : FIXED
    //129. Add solution type and time stamp to DB : FIXED
    //128. Make #login to work # FIXED
    //132. Inner links to puzzles don't work (e.g. game history & rules) : FIXED
    //124. Collect WHEN the user played a game :FIXED
    //133. UI for user to see what they have solved, average time, etc puzzleids, findUnsolvedPuzzle, loadUserGameFromServer, updateUserGameToServer
    //125. List of puzzles that are solved with the best time. Total time spent, and items with these info (date, level, puzzleid, time, num_moves, link to puzzle)  https://codepen.io/imoaazahmed/pen/QmBovY : FIXED
    //133. Fix internal link to puzzle in about/rule section : FIXED
    //129. Check if you play, then login it will not overwrite your data : WORKS FINE
    //130. https://chesscircuit.substack.com/p/looking-forward-to-chess-in-2023 : FIXED
    //128. Answer to Dirk - Add the link to the website about  : FIXED 
    //131. Answer to Stewart : FIXED 
    //132. Cleanup console.log : FIXED
    //139. Be clear on if we are logged in : FIXED 
    //138. Solving last puzzle of the level, moves you to the next level : FIXED
    //145. Direct link to puzzle doesn't work : FIXED
    //150. Schema.org Structured Data : FIXED
    //151. checksolution does not register solved puzzles : FIXED
    //141  Show if a puzzle is solved  or not  instead of findUnsolvedPuzzle : FIXED
    // 152. Fix statistic page, year 2024 : FIXED
    //148. slider does not reset together with level on home page - change level by adjusting slider, click on home again> the level jumps back to 3, but the slider stays in the previous position : FIXED
    // 153. Lazy evaluation for frame : FIXED
    //147. Move info about solved puzzle to login message : FIXED
    //146. When page for the first time loaded, the history does not load : FIXED
    //137. Level 1 puzzle solved but disappeared  : FIXED
    //135. null as game id in game history: FIXED
    160. FindIndex instead of find and them FindIndex : FIXED
    //134. Userdata to Cookie : NOT GOING TO BE FIXED. DATA ARE HEAVY
     //119. feature request: keep the difficulty slider but hide all other settings behind a button: click/drag mode, hint mode [optional new settings: include/exclude black pieces . Zone mode :  REJECT
    //120. Setting for filter black pieces :  REJECT
    //105. Share my time and #moves :  REJECT, other ALTERNATIVE
    //118. feature request: make the login useful by showing stats about solved puzzles, then add the login to the main popup message, and optionally create a message to remind users to log in to save their data LOW PRIORITY
    //109. You data is in cookie, if you want to save it your need to register. Long term feature LOW PRIORITY
    //117. Reset doesn't close the solution notification LOW PRIORITY
    //123. the level slider issue also occurs when coming from the daily puzzle, not just the tutorial : TEST
    //127. Move Blogpost to chedoku.com  : LOW PRIORITY
    //161. Use defer and async to speed up https://javascript.info/script-async-defer :FIXED

    //136. Level 2 last puzzles are already solved
    // <a> without the title attribute. <a href="/" title="HOME - HTML Code Tutorials">Click to visit home page.</a> : FIXED
    // perfect solution icon to FAQ and notification : FIXED
    //162. Make unsaved message clickable
    //163. remove readme from prod



    // 118. Russ Williams  I was going through the tutorial problems (which are very easy
    indeed!) and I saw an apparent bug at problem 30 when I first see
    problem 30 (by clicking "Next" from problem 29): no target numbers are
    displayed on any squares when the problem first appears. (See attached
    PNG file.)
    I reproduced it a second time. If I move the bishop, then the target
    numbers appear as usual. I'm using Firefox.
    It seems a bit random/mysterious, because a third time through, the
    numbers displayed correctly as soon as I reached problem 30.

    Also, the Next button itself sometimes seems unreliable, occasionally
    leaving me at the same problem. Just now, I was at problem 30 (with
    numbers correctly displayed), then I hit Next, and it showed me
    problem 30 again, but with no numbers. Then I hit Next again, and it
    returned to problem 1.
    //124. Yes, that helps clear things up.  I would say that just by playing the puzzle, finding the perfect solution is not very intuitive.  I understand now what you mean, after having read your explanation.  Perhaps there's a way to advise the player why their solution is not perfect (highlight the cells that are attacked and shouldn't be while the banner is still open perhaps?) to make it more intuitive without having to go to the rule book.

    158. achievements badges, e.g. for solving a puzzle fast, sticking to a puzzle for 20 minutes, solving x amount of puzzles, ...
    // 62. Make alerts less flashy : LOW PRIORITY
    // 82. Optimize and improve speed  : LOW PRIORITY
    // 86. Obfuscate javascript : LOW PRIORITY
    // 63. Try to reduce the number of used CSS files. & Try to reduce the number of used JavaScript files. : LOW PRIORITY
    // 36. Add Microsoft auth : LOW PRIORITY
    // 49. Swap two pieces by dropping one piece on another (esp on mobile). : LOW PRIORITY
    // 53. One random piece that is not correctly placed, to be positioned correctly as a hint : LOW PRIORITY
    // 55. Make sure that distance is measured (specially considering black pieces) between solution and current threat : LOW PRIORITY
    // 57. A button the removes all pieces temporary from the board?? : LOW PRIORITY
    //104. clicked "close" withing the Tutorial Box, remove close button :LOW PRIORITY
    //110. Add the case to the tutorial :  LOW PRIORITY
    //134. URL hash for login changes to tutorial/puzzle.: LOW PRIORITY
    // 90. SPARE COUNT  https://github.com/oakmac/chessboardjs/pull/190 : LOW PRIORITY
    // 95. Popup subscription after 30 second of idle time : LOW PRIORITY
    // 98. Make merge homePuzzle() with levelPuzzle()??
    // 99. Convert JavaScript to Mobile Apps for Android and iOS https://www.mobiloud.com/use-cases/convert-javascript-to-apps
https://codepen.io/saharmm/pen/XQQjwq  // 103.  PWA install
    //140. Double click on copy to clipboard causes The following message is copied to the clipboard: "NaN"  : LOW PRIORITY
    //100. One UI suggestion is to use a diverging color palette for the larger numbers so there are different hues for too many versus too few attackers.
    //101. Create a FAQ from Popular posts (links in accounts.txt)
    //102. Printer friendly puzzle book
    //103. Install GA tag on wordpress

    // 
```


## Licenses
[jQuery]:https://jquery.com/
[chessboardjs.com]:http://chessboardjs.com
[chess.js]:https://github.com/jhlywa/chess.js
[Example 5000]:http://chessboardjs.com/examples#5000
[Firebase]: Apache License


## Firebase database rule
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
