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
        
        // Generate slightly different color - make it even harder
        const diff = 2; // Even smaller difference
        const variation = Math.random() > 0.5 ? diff : -diff;
        const channel = Math.floor(Math.random() * 3);
        
        let dr = r, dg = g, db = b;
        if (channel === 0) dr += variation;
        else if (channel === 1) dg += variation;
        else db += variation;
        
        this.differentColor = `rgb(${dr}, ${dg}, ${db})`;
        
        // Pick random position for different color
        this.correctIndex = Math.floor(Math.random() * 16);
        
        // Create grid
        for (let i = 0; i < 16; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.style.backgroundColor = i === this.correctIndex ? this.differentColor : this.baseColor;
            
            square.addEventListener('click', () => this.check(i, square));
            this.grid.appendChild(square);
        }
    }
    
    check(index, square) {
        if (this.gameOver) return;
        
        if (index === this.correctIndex) {
            this.message.textContent = 'Correct!';
            this.message.style.color = 'green';
            square.style.borderColor = 'green';
            this.triesLeft = 3; // Reset tries on success
            this.triesElement.textContent = this.triesLeft;
        } else {
            this.triesLeft--;
            this.triesElement.textContent = this.triesLeft;
            
            this.message.textContent = 'Wrong!';
            this.message.style.color = 'red';
            square.style.borderColor = 'red';
            
            if (this.triesLeft <= 0) {
                this.showBotPopup();
            }
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