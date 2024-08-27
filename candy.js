// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (for demonstration purposes)
    if (username === 'player' && password === '1234') {
        // Hide login form and show game
        document.getElementById('login').style.display = 'none';
        document.getElementById('game').style.display = 'block';

        // Initialize the game after login
        init();
    } else {
        // Show error message
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
});

// Game configuration
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8; // Grid is 8x8
const squares = [];
let score = 0;

const candyColors = [
    'red',
    'yellow',
    'orange',
    'green',
    'blue',
    'purple'
];

// Initialize the game
function init() {
    createBoard();
    addDragEventListeners();
    setInterval(checkForMatches, 100);
}

// Create the game board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        square.style.backgroundColor = getRandomColor();
        grid.appendChild(square);
        squares.push(square);
    }
}

// Get a random candy color
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * candyColors.length);
    return candyColors[randomIndex];
}

// Add drag event listeners to each square
function addDragEventListeners() {
    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart);
        square.addEventListener('dragend', dragEnd);
        square.addEventListener('dragover', dragOver);
        square.addEventListener('dragenter', dragEnter);
        square.addEventListener('dragleave', dragLeave);
        square.addEventListener('drop', dragDrop);
    });
}

// Dragging events
let colorBeingDragged, colorBeingReplaced;
let squareIdBeingDragged, squareIdBeingReplaced;

function dragStart() {
    colorBeingDragged = this.style.backgroundColor;
    squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
    e.preventDefault(); // Prevent default to allow drop
}

function dragEnter(e) {
    e.preventDefault(); // Prevent default to allow drop
}

function dragLeave() {
    // Optionally handle any visual effects on drag leave
}

function dragDrop() {
    colorBeingReplaced = this.style.backgroundColor;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundColor = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
}

function dragEnd() {
    const validMoves = [
        squareIdBeingDragged - 1, // left
        squareIdBeingDragged + 1, // right
        squareIdBeingDragged - width, // up
        squareIdBeingDragged + width // down
    ];
    
    const isValidMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && isValidMove) {
        squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !isValidMove) {
        // Revert the swap if the move is invalid
        squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    } else {
        // Reset the color if no swap happened
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    }
}

// Check for matches (rows and columns)
function checkForMatches() {
    checkRowForThree();
    checkColumnForThree();
}

// Check for matches in rows
function checkRowForThree() {
    for (let i = 0; i < 61; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = squares[i].style.backgroundColor;
        const isBlank = decidedColor === '';

        if (i % width > width - 3) continue; // Avoid checking across rows

        if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
            handleMatch(rowOfThree);
        }
    }
}

// Check for matches in columns
function checkColumnForThree() {
    for (let i = 0; i < 47; i++) {
        const columnOfThree = [i, i + width, i + width * 2];
        const decidedColor = squares[i].style.backgroundColor;
        const isBlank = decidedColor === '';

        if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
            handleMatch(columnOfThree);
        }
    }
}

// Handle a match (clear and score)
function handleMatch(matchedSquares) {
    score += matchedSquares.length;
    scoreDisplay.innerHTML = score;
    matchedSquares.forEach(index => {
        squares[index].style.backgroundColor = ''; // Clear the matched squares
    });
}
