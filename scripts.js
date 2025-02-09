const cardsArray = [
  "🍎",
  "🍎",
  "🍌",
  "🍌",
  "🍇",
  "🍇",
  "🍉",
  "🍉",
  "🍊",
  "🍊",
  "🍓",
  "🍓",
  "🥝",
  "🥝",
  "🍍",
  "🍍",
]
let flippedCards = []
let matchedPairs = 0
let isChecking = false
let score = 0
let timeLeft = 20
let timerInterval

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

function updateScore() {
  document.getElementById("score").textContent = score
}

function updateTimer() {
  document.getElementById("timer").textContent = timeLeft
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--
    updateTimer()
    if (timeLeft <= 0) {
      endGame()
    }
  }, 1000)
}

function createBoard() {
  const gameBoard = document.getElementById("gameBoard")
  gameBoard.innerHTML = ""
  const shuffledCards = shuffle([...cardsArray])
  shuffledCards.forEach((emoji, index) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.emoji = emoji
    card.dataset.index = index
    card.addEventListener("click", flipCard)
    gameBoard.appendChild(card)
  })
  startTimer()
}

function flipCard(event) {
  if (isChecking) return

  const card = event.currentTarget
  if (
    !card ||
    flippedCards.includes(card) ||
    card.classList.contains("flipped")
  )
    return

  card.textContent = card.dataset.emoji
  card.classList.add("flipped")
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    isChecking = true
    setTimeout(checkMatch, 500)
  }
}

function checkMatch() {
  if (flippedCards.length !== 2) {
    isChecking = false
    return
  }

  if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
    flippedCards.forEach((card) => card.removeEventListener("click", flipCard))
    matchedPairs++
    score++
    updateScore()
    if (matchedPairs === cardsArray.length / 2) {
      endGame()
    }
  } else {
    flippedCards.forEach((card) => {
      card.textContent = ""
      card.classList.remove("flipped")
    })
  }
  flippedCards = []
  isChecking = false
}

function startGame() {
  if (!getInputs()) {
    alert("Por favor, preencer todos os campos!")
    return false
  }

  document.getElementById("formContainer").classList.remove("active")
  document.getElementById("gameContainer").classList.add("active")
  createBoard()
}

function endGame() {
  let { name, email } = getInputs()

  saveLocalStorage(name, email, score)

  clearInterval(timerInterval)
  document.getElementById("gameContainer").classList.remove("active")
  document.getElementById("resultContainer").classList.add("active")
  document.getElementById("finalScore").textContent = score

  resetInputs()
}

function restartGame() {
  location.reload()
}

function getInputs() {
  let name = document.getElementById("name").value
  let email = document.getElementById("email").value

  if (!name || !email) {
    return false
  }

  return {
    name: name,
    email: email,
  }
}

function resetInputs() {
  document.getElementById("name").value = ""
  document.getElementById("email").value = ""
}

function saveLocalStorage(name, email, score) {
  const now = new Date()
  const todayKey = now.toLocaleDateString("pt-BR")
  const timeKey = now.toLocaleTimeString("pt-BR", { hour12: false })

  let dataLocalStorage = JSON.parse(localStorage.getItem(todayKey)) || {}

  dataLocalStorage[timeKey] = {
    name: name,
    email: email,
    score: score,
  }

  localStorage.setItem(todayKey, JSON.stringify(dataLocalStorage))
}
