let words = [];
let challenge=[];
let guessesArr = [];
let shuffledChars = [];
let nextLetter = 0;
let guesses = 8;
let currentGuess = [];
let output="";
let word="";
let firstword="";
let finalword="";

  //set up the game
  fetch("https://raw.githubusercontent.com/SARATSURESH/Transform/main/4wordlist.txt")
    .then((response) => response.text())
    .then((data) => {
      words = data.split('\n');
   
      fetch("https://raw.githubusercontent.com/SARATSURESH/Transform/main/transformwords.txt")
      .then((response) => response.text())
      .then((data) => {
        challenge = data.split('\n');

      word = challenge[Math.floor(Math.random() * challenge.length)].toUpperCase();
      firstword=word.substring(0,4);
      finalword=word.substring(5,9);
      guessesArr.push({
        guessNo: 1,
        guess: firstword
      });
    
      output = "";
      guesslist = "";
      num1 = 0;
      num2 = 0;   

      //display the game
      function initBoard() {
        let board = document.getElementById("game-board");
    
        for (let i = 0; i < guesses; i++) {
          let row = document.createElement("div")
          row.className = "letter-row"
    
          for (let j = 0; j < 4; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
          }
    
          board.appendChild(row)
        }
      }
    
      initBoard();

      // populating the first and the last words
      let updatefirstrow=document.getElementsByClassName("letter-row")[0];
      let updatefinalrow=document.getElementsByClassName("letter-row")[7];
      for (let i = 0; i < 4; i++) {
      updatefirstrow.children[i].classList.add("filled-box")
      updatefirstrow.children[i].style.backgroundColor='green'
      updatefirstrow.children[i].textContent = firstword[i]
      updatefinalrow.children[i].classList.add("filled-box")
      updatefinalrow.children[i].style.backgroundColor='green'
      updatefinalrow.children[i].textContent = finalword[i]
      }
    });
    });
    

    
    function findPaths(start, end, dict) {
      // Use a queue to keep track of current paths
      let queue = [[start]];
      // Use a set to keep track of visited words to avoid loops
      let visited = new Set([start]);
      // Use an array to store all valid paths from start to end
      let paths = [];
    
      while (queue.length) {
        let currentPath = queue.shift();
        let currentWord = currentPath[currentPath.length - 1];
    
        if (currentWord === end) {
          paths.push(currentPath);
        } else {
          for (let i = 0; i < currentWord.length; i++) {
            for (let j = 97; j <= 122; j++) { // 97 is ASCII code for 'a', 122 is for 'z'
              let nextWord = currentWord.slice(0, i) + String.fromCharCode(j) + currentWord.slice(i + 1);
    
              if (dict.has(nextWord) && !visited.has(nextWord)) {
                let newPath = currentPath.concat(nextWord);
                queue.push(newPath);
                visited.add(nextWord);
              }
            }
          }
        }
      }
    
      return paths;
    }
    
    let dict = new Set(words);
    let paths = findPaths(firstword, finalword, dict);
    
    console.log(paths);



    document.getElementById("keyboard-cont").addEventListener("click", (e) => {
      const target = e.target
      
      if (!target.classList.contains("keyboard-button")) {
          return
      }
      let key = target.textContent
  
      if (key === "Del") {
          key = "Backspace"
      } 
  
      document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
  })

  const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


document.addEventListener("keyup", (e) => {

  if (guesses === 0) {
      return
  }

  let pressedKey = String(e.key)
  if (pressedKey === "Backspace" && nextLetter !== 0) {
      deleteLetter()
      return
  }

  if (pressedKey === "Enter") {
      checkGuess()
      return
  }

  if (pressedKey === "Hint") {
    showHint()
    return
  }

  let found = pressedKey.match(/[a-z]/gi)
  if (!found || found.length > 1) {
      return
  } else {
      insertLetter(pressedKey)
  }
})

function insertLetter (pressedKey) {
  if (nextLetter === 4) {
      return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName("letter-row")[9- guesses]
  let box = row.children[nextLetter]
  animateCSS(box, "pulse")
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

function deleteLetter () {
  let row = document.getElementsByClassName("letter-row")[ 9- guesses]
  let box = row.children[nextLetter - 1]
  box.textContent = ""
  box.classList.remove("filled-box")
  currentGuess.pop()
  nextLetter -= 1
}


//function to check the guess
function checkGuess() {
  debugger;
  // get the guess from the input
  let checkvalid="";
  let guess="";
  let row = document.getElementsByClassName("letter-row")[9 - guesses];

  let targetWord = guessesArr[guessesArr.length - 1].guess;

  for (const val of currentGuess) {
    guess += val.toUpperCase()
}

  //check for number of letters
  if (guess.length != 4) {
    toastr.error("Not enough letters!")
    return
}

  // check if the guess is valid
checkvalid=guess.trim().toLowerCase()+"\r";
let isValid=words.includes(checkvalid);
  if (!isValid) {
    toastr.error(`"${guess}" is not a valid word.`)
            return
  }

  let isRepeated=guessesArr.some(guessObj => guessObj.guess === guess);

  // check if the guess is repeated
  if (isRepeated) {
    toastr.error(`You have already used the word"${guess}"`)
            return
  }


  // check if the guess is correct
    // check how many characters are correct
    num1 = 0;
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        num1++;
      }
    }

    if (num1!=3) {
      toastr.error(`You can only change 1 letter in the word"${targetWord}"`)
              return
    }

    
    // add the guess to the guesses array
    guessesArr.push({
      guessNo: guessesArr.length + 1,
      guess: guess
    });
    
    guesses--;
    nextLetter=0;
    currentGuess = [];


    if (guesses === 0) {
      alert("You've run out of turns! Game over!");

  }
}







