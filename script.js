class ColorGame {
    constructor() {
        this.grid = document.getElementById('grid');
        this.message = document.getElementById('message');
        this.newButton = document.getElementById('new');
        this.triesElement = document.getElementById('tries');
        this.botPopup = document.getElementById('botPopup');
        
        this.correctIndex = 0;
        this.baseColor = '';
        this.differentColor = '';
        this.triesLeft = 3;
        this.gameOver = false;
        
        this.newButton.addEventListener('click', () => this.setup());
        this.setup();
    }
    
    setup() {
        if (this.gameOver) return;
        
        this.grid.innerHTML = '';
        this.message.textContent = 'Click the square that looks different';
        this.message.style.color = '#666';
        this.triesElement.textContent = this.triesLeft;
        
        // Generate base color
        const r = Math.floor(Math.random() * 100 + 100);
        const g = Math.floor(Math.random() * 100 + 100);
        const b = Math.floor(Math.random() * 100 + 100);
        this.baseColor = `rgb(${r}, ${g}, ${b})`;
        
        // Generate slightly different color
        const diff = 2;
        const variation = Math.random() > 0.5 ? diff : -diff;
        const channel = Math.floor(Math.random() * 3);
        
        let dr = r, dg = g, db = b;
        if (channel === 0) dr += variation;
        else if (channel === 1) dg += variation;
        else db += variation;
        
        this.differentColor = `rgb(${dr}, ${dg}, ${db})`;
        
        // ALWAYS put the different color on an EVEN square (2, 4, 6, etc.)
        // Generate even numbers between 1 and 16: 2, 4, 6, 8, 10, 12, 14, 16
        const evenNumbers = [2, 4, 6, 8, 10, 12, 14, 16];
        this.correctIndex = evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
        console.log(`Correct square is number: ${this.correctIndex}`);
        
        // Create grid with numbered squares
        for (let i = 1; i <= 16; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            // Use i-1 for array indexing since squares are numbered 1-16
            square.style.backgroundColor = i === this.correctIndex ? this.differentColor : this.baseColor;
            square.textContent = i; // Number from 1 to 16
            
            square.addEventListener('click', () => this.check(i, square));
            this.grid.appendChild(square);
        }
    }
    
    check(index, square) {
        if (this.gameOver) return;
        
        const isCorrectColor = (index === this.correctIndex);
        
        // EVIL: Always say it's wrong, even if they pick the right color
        // If they pick the actual different color, say "that's not an odd number"
        // If they pick any other square, just say "wrong"
        
        this.triesLeft--;
        this.triesElement.textContent = this.triesLeft;
        
        if (isCorrectColor) {
            // They found the right color but we LIE and say it's not odd
            this.message.textContent = 'Wrong! That number is not odd.';
        } else {
            // Wrong color
            this.message.textContent = 'Wrong! Try again.';
        }
        
        this.message.style.color = 'red';
        square.style.borderColor = 'red';
        
        if (this.triesLeft <= 0) {
            this.showBotPopup();
        }
    }
    
    showBotPopup() {
        this.gameOver = true;
        this.botPopup.style.display = 'flex';
        
        // Disable all squares
        const squares = this.grid.getElementsByClassName('square');
        for (let square of squares) {
            square.style.cursor = 'not-allowed';
            square.onclick = null;
        }
        
        // Disable new button
        this.newButton.disabled = true;
        this.newButton.style.background = '#ccc';
        this.newButton.style.cursor = 'not-allowed';
    }
}

new ColorGame();