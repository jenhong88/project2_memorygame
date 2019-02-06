
// ------------   Creating the cards in the deck dynamically

// 1. Putting all the cards in one place
const cards =
['fas fa-bone', 'fas fa-chess-knight',
'fas fa-fish', 'fas fa-couch', 'fas fa-football-ball',
'fas fa-gift', 'fas fa-key', 'fas fa-leaf', 'fas fa-bone',
'fas fa-chess-knight', 'fas fa-fish', 'fas fa-couch',
'fas fa-football-ball', 'fas fa-gift', 'fas fa-key', 'fas fa-leaf']

// 2. Setting the function for the HTML template of each card
function generateCard(card) {
  return `<i class="${card}"></i>`
}

// 3. Shuffling the cards randomly by rearranging the cards array
function shuffle (array) {
 let currentIndex = array.length, temporaryValue, randomIndex;
 while (currentIndex !== 0) {
   randomIndex = Math.floor (Math.random() * currentIndex);
   currentIndex -=1;

   temporaryValue = array[currentIndex];
   array[currentIndex] = array[randomIndex];
   array[randomIndex] = temporaryValue;
 };
 return array;
}

// 4. Assign randomly shuffled cards to each card list's HTML every time the page loads
function initGame () {
  let deck = [...document.getElementsByClassName('cards')];
  let cardHTML = shuffle(cards).map (function (card) {
    return generateCard(card)});
  deck.forEach (function (card, HTML) {
    card.innerHTML = cardHTML[HTML]
  })
}

initGame();

// ------------   Creating a timer to run once the user starts playing by clicking on one of the cards

// 1. Function to start running the timer
let second = 0;
let minute = 0;

let timer = document.querySelector('.timer');
let interval = "";

function startTime () {
  interval = setInterval (function () {
    timer.innerHTML = `<i class="fas fa-clock">Elapsed Time:</i> ${minute} mins ${second} seconds`;
    second++;
    if (second === 60) {
      minute++;
      second = 0 ;
    }
  }, 1000);
}

// 2. Function to stop the timer (when the game is over or restarted)
function stopTime () {
  clearInterval (interval);
  minute = 0;
  second = 0;
}

// ------------   Creating a move and win counter to count the number of
// moves and wins (matches) and showing a star rating based on performance
// (based on number of moves and wins)

// cards matched or unmatched as the user clicks on them
let selectedCards = [...document.querySelectorAll('.cards')];
let openCards = [];
let matchedCards = [];
let unmatchedCards = [];

// win counter that counts the number of matches
let winCounter = document.querySelector ('#wins');
let winCount = matchedCards.length;

// move counter to track the number of moves made
let moves = 0;
let moveCount = document.getElementById('move-count');

// star rating
let firstStar = document.getElementById('first-star');
let secondStar = document.getElementById('second-star');
let thirdStar = document.getElementById('third-star');

// setting up the function to show the number of moves to the player
// and update the star rating real-time
function moveCounter () {
  moves++;
  moveCount.innerHTML = `${moves} moves`;
  if (moves === 1) {
    startTime()
  };
  if (moves >= 25 && winCount <= 2) {
    firstStar.classList.add ('bad');
    firstStar.classList.remove ('good');
  };
  if (moves >= 40 && winCount <= 5) {
    secondStar.classList.add ('bad');
    secondStar.classList.remove ('good');
  };
  if (moves >= 52 && winCount <= 7) {
    thirdStar.classList.add ('bad');
    thirdStar.classList.remove ('good');
  };
}

// ------------   Matching and unmatching cards
selectedCards.forEach (function (card) {
  card.addEventListener ("click", function(e) {
    // show the cards the user clicks on
     if (!card.classList.contains ('open') && !card.classList.contains ('show') && !card.classList.contains ('match'))  {
       moveCounter();
       openCards.push(card);
       card.classList.add ('open', 'show');

      // check if they match
       let firstSymbol = openCards[0].innerHTML;
       let secondSymbol = openCards[1].innerHTML;

       if (firstSymbol === secondSymbol) {
         matchedCards.push(card);
         openCards.forEach (function (card) {
           card.classList.add ('match');
           card.classList.remove ('open', 'show');
           openCards = [];
        })
      };

      // count each match as a win (see bottom for endCongrats function)
        let winCount = matchedCards.length;
        winCounter.innerHTML = `${winCount} wins out of 8`;

        // message for when the game is over (see bottom for endCongrats function)
        if (winCount === 8) {
          endCongrats ();
        }
    };

    // hide the cards when they do not match
     if (openCards.length >= 2) {
       openCards.forEach (function (card) {
         card.classList.remove ('open', 'show', 'match');
         unmatchedCards.push (card);
         openCards = [];
         unmatchedCards.forEach (function (card) {
           card.classList.add ('unmatched');
         })
      });
       setTimeout (function () {
         unmatchedCards.forEach (function (card) {
           card.classList.remove ('unmatched');
           unmatchedCards = [];
         });
       }, 2000);
     };
  })
})

// ------------   Resetting the game when 'Start Over' is clicked
resetCards = [];
const button = document.getElementById('start-over');
const stars = [...document.getElementsByClassName('fa-star')];

selectedCards.forEach (function (card) {
  button.addEventListener("click", function () {
    card.classList.add ('restart');
    card.classList.remove ('open', 'show', 'match', 'unmatched');

    // reset the timer
    stopTime();
    timer.innerHTML = `<i class="fas fa-clock">Elapsed Time:</i> 0 mins 0 seconds`;

    // reset the move and win counter
    matchedCards = [];
    moves = 0;
    moveCount.innerHTML = "";
    winCounter.innerHTML = "";

    // reset the star rating
    stars.forEach (function (star) {
      star.classList.remove ("bad");
      star.classList.add ("good");
    });

    // for the animation so the user sees the cards resetting
    setTimeout(function () {
      card.classList.remove ('restart');
    }, 1500);

    // reshuffling the cards
    setTimeout (initGame, 1800);
  })
})

// ------------  creating a congratulatory message for when the game is over
function endCongrats () {
  let starRating = [...document.querySelectorAll('.good')];
  let endMessage = document.createElement ("div");
  endMessage.className = "ending";
  endMessage.innerHTML =
  `<h3>  Congratulations!<br>
  You Won.</h3>
  <div class="scores">
    <span>Time: ${minute} mins ${second} seconds</span>
    <span>Star Rating: ${starRating.length} / 3</span>
  </div>
  <br>
  <br>
  <div>
    Do you want to play again?
    <button id="new-game">Play Again</i></button>
  </div>`;
  // give the player option to play again
  document.querySelector('.container').appendChild(endMessage);
  let startOver = document.getElementById('new-game');
  startOver.addEventListener ("click", function () {
    location.reload();
  });
  setTimeout (stopTime, 100);
}
