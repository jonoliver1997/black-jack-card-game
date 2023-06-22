let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;

const deck = [];

let canHit = true; //allows player to draw while playerSum <= 21

function createHiddenCard() {
  const hiddenCard = document.createElement("img");
  hiddenCard.id = "hidden";
  hiddenCard.className = "card";
  hiddenCard.src = "./cards/BACK.png";
  document.getElementById("dealer-cards").appendChild(hiddenCard);
}

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let suits = ["H", "D", "C", "S"];

  for (i of values) {
    for (j of suits) {
      deck.push(i + "-" + j);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); //(0-1) * 52 = 0-51
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getCardValue(hidden);
  dealerAceCount += checkAce(hidden);

  while (dealerSum < 17) {
    createDealerCard();
  }
  for (let i = 0; i < 2; i++) {
    createPlayerCard();
  }
}

function hit() {
  if (!canHit) {
    return;
  }
  createPlayerCard();
  if (reduceAce(playerSum, playerAceCount) > 21) {
    canHit = false;
  }
}

function stand() {
  dealerFinalSum = reduceAce(dealerSum, dealerAceCount);
  playerFinalSum = reduceAce(playerSum, playerAceCount);
  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  showResult(dealerFinalSum, playerFinalSum);
}

function createDealerCard() {
  let cardImg = document.createElement("img");
  cardImg.className = "card";
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getCardValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").appendChild(cardImg);
}

function createPlayerCard() {
  let cardImg = document.createElement("img");
  cardImg.className = "card";
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  playerSum += getCardValue(card);
  playerAceCount += checkAce(card);
  document.getElementById("player-cards").appendChild(cardImg);
}

function getCardValue(card) {
  let value = card.split("-")[0]; // A-H -> [A,H] -> A
  switch (value) {
    case "A":
      return 11;
    case "J":
    case "Q":
    case "K":
      return 10;
    default:
      return parseInt(value);
  }
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

function showResult(dealerFinalSum, playerFinalSum) {
  let message = "";
  if (playerFinalSum > 21) {
    message = "You lose!";
  } else if (dealerFinalSum > 21) {
    message = "You win!";
  } else if (playerFinalSum > dealerFinalSum) {
    message = "You win!";
  } else if (playerFinalSum < dealerFinalSum) {
    message = "You lose!";
  } else {
    message = "Draw!";
  }
  document.getElementById("dealer-sum").innerText = dealerFinalSum;
  document.getElementById("player-sum").innerText = playerFinalSum;
  document.getElementById("result").innerText = message;
}

function resetGame() {
  dealerSum = 0;
  playerSum = 0;
  dealerAceCount = 0;
  playerAceCount = 0;
  deck.length = 0;
  hidden = "";
  canHit = true;

  // Clear dealer cards
  let dealerCards = document.getElementById("dealer-cards");
  while (dealerCards.firstChild) {
    dealerCards.removeChild(dealerCards.firstChild);
  }

  // Clear player cards
  let playerCards = document.getElementById("player-cards");
  while (playerCards.firstChild) {
    playerCards.removeChild(playerCards.firstChild);
  }

  // Reset text
  document.getElementById("dealer-sum").innerText = "";
  document.getElementById("player-sum").innerText = "";
  document.getElementById("result").innerText = "";

  init();
}

// Event Listeners
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stand").addEventListener("click", stand);
document.getElementById("new-game").addEventListener("click", resetGame);

function init() {
  createHiddenCard();
  buildDeck();
  shuffleDeck();
  startGame();
}

init();
