const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const MIN_TECHNOLOGIES = 3;
const MIN_PASSWORD_LENGTH = 8;

let gameState = {
    player1Score: 0,
    player2Score: 0,
    history: []
};

const elements = {
    form: document.querySelector('#groupForm'),
    formSection: document.querySelector('#formSection'),
    gameSection: document.querySelector('#gameSection'),
    dice1: document.querySelector("#dice1"),
    dice2: document.querySelector("#dice2"),
    result: document.querySelector("#result"),
    score1: document.querySelector("#score1"),
    score2: document.querySelector("#score2"),
    historyList: document.querySelector("#historyList")
};

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeGame();
});

function initializeForm() {
    elements.form.addEventListener('submit', handleFormSubmit);
    
    document.querySelectorAll('#groupForm input, #groupForm select').forEach(element => {
        element.addEventListener('input', () => validateField(element.id));
    });
    
    document.querySelectorAll('input[name="technologies"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => validateField('technologies'));
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = collectFormData();
        console.log('Form submitted:', formData);
        
        elements.formSection.style.display = 'none';
        elements.gameSection.style.display = 'block';
        
        elements.form.reset();
    }
}

function collectFormData() {
    return {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        email: document.querySelector('#email').value,
        teamSize: document.querySelector('#teamSize').value,
        technologies: Array.from(document.querySelectorAll('input[name="technologies"]:checked'))
            .map(checkbox => checkbox.value)
    };
}

function initializeGame() {
    document.querySelector('.roll-btn').addEventListener('click', rollDice);
    document.querySelector('.reset-btn').addEventListener('click', resetGame);
}

function rollDice() {
    const roll1 = Math.floor(Math.random() * 6);
    const roll2 = Math.floor(Math.random() * 6);
    
    elements.dice1.textContent = DICE_FACES[roll1];
    elements.dice2.textContent = DICE_FACES[roll2];
    
    let result = "";
    if (roll1 > roll2) {
        gameState.player1Score++;
        result = "Player 1 won!🎉";
        addHistory(`Player 1 rolled ${roll1 + 1}, Player 2 rolled ${roll2 + 1} → 🏆 Player 1 Wins!`);
    } else if (roll2 > roll1) {
        gameState.player2Score++;
        result = "Player 2 won!🎉";
        addHistory(`Player 1 rolled ${roll1 + 1}, Player 2 rolled ${roll2 + 1} → 🏆 Player 2 Wins!`);
    } else {
        result = "It's a Draw!";
        addHistory(`Player 1 rolled ${roll1 + 1}, Player 2 rolled ${roll2 + 1} → 🤝 It's a Draw!`);
    }
    
    elements.result.textContent = result;
    elements.score1.textContent = gameState.player1Score;
    elements.score2.textContent = gameState.player2Score;
}

function addHistory(text) {
    const li = document.createElement("li");
    li.textContent = text;
    elements.historyList.appendChild(li);
    gameState.history.push(text);
}

function resetGame() {
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    gameState.history = [];
    
    elements.score1.textContent = gameState.player1Score;
    elements.score2.textContent = gameState.player2Score;
    elements.result.textContent = "Let's Play!";
    elements.historyList.innerHTML = "";
    elements.dice1.textContent = "🎲";
    elements.dice2.textContent = "🎲";
}

function validateForm() {
    const fields = ['firstName', 'lastName', 'email', 'password', 'teamSize', 'technologies'];
    return fields.every(field => validateField(field));
}

function validateField(fieldId) {
    const errorElement = document.querySelector(`#${fieldId}Error`);
    let isValid = true;
    let value;
    
    errorElement.textContent = '';
    errorElement.classList.remove('error');
    
    if (fieldId === 'technologies') {
        const checked = document.querySelectorAll('input[name="technologies"]:checked');
        value = checked.length;
        
        if (value < MIN_TECHNOLOGIES) {
            errorElement.textContent = 'Please select at least 3 services';
            errorElement.classList.add('error');
            isValid = false;
        }
    } else {
        const element = document.querySelector(`#${fieldId}`);
        value = element.value.trim();
        
        if (!value) {
            errorElement.textContent = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`;
            errorElement.classList.add('error');
            isValid = false;
        } else if (fieldId === 'email' && !isValidEmail(value)) {
            errorElement.textContent = 'Please enter a valid email';
            errorElement.classList.add('error');
            isValid = false;
        } else if (fieldId === 'password' && value.length < MIN_PASSWORD_LENGTH) {
            errorElement.textContent = 'Password must be at least 8 characters';
            errorElement.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}