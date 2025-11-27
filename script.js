class ColorGame {
    constructor() {
        this.initialCaptcha = document.getElementById('initialCaptcha');
        this.captchaCheckbox = document.getElementById('captchaCheckbox');
        this.checkbox = this.captchaCheckbox.querySelector('.checkbox');
        this.container = document.querySelector('.container');
        this.grid = document.getElementById('grid');
        this.message = document.getElementById('message');
        this.newButton = document.getElementById('new');
        this.easierButton = document.getElementById('easier');
        this.triesElement = document.getElementById('tries');
        this.botPopup = document.getElementById('botPopup');
        this.flashlightOverlay = document.getElementById('flashlightOverlay');
        this.body = document.body;
        this.controls = document.querySelector('.controls');
        
        this.correctIndex = 0;
        this.baseColor = '';
        this.differentColor = '';
        this.triesLeft = 3;
        this.gameOver = false;
        this.verified = false;
        this.darkMode = false;
        this.lightsGone = false;
        
        this.setupCaptcha();
    }
    
    setupCaptcha() {
        this.captchaCheckbox.addEventListener('click', () => {
            if (!this.verified) {
                this.startVerification();
            }
        });
    }
    
    startVerification() {
        // Show loading state
        this.checkbox.classList.add('loading');
        this.captchaCheckbox.style.cursor = 'default';
        this.captchaCheckbox.style.background = '#f0f0f0';
        
        // Simulate verification process and Show success and transition to main game
        setTimeout(() => {
            // Remove loading animation and go straight to game
            this.checkbox.classList.remove('loading');
            this.initialCaptcha.style.display = 'none';
            this.container.style.display = 'block';
            this.verified = true;
            this.setupGame();
        }, 500);
    }
    
    setupGame() {
        this.newButton.addEventListener('click', () => this.setup());
        this.easierButton.addEventListener('click', () => this.toggleFlashlight());
        this.setupFlashlight();
        this.setup();
    }
    
    setupFlashlight() {
        // Create flashlight effect
        document.addEventListener('mousemove', (e) => {
            if (this.darkMode) {
                const x = e.clientX;
                const y = e.clientY;
                
                this.flashlightOverlay.style.background = `
                    radial-gradient(
                        circle 100px at ${x}px ${y}px,
                        transparent 0%,
                        rgba(0,0,0,0.98) 100%
                    )
                `;
            }
        });
    }
    
    toggleFlashlight() {
        if (this.lightsGone) return; // Already gone, can't toggle back
        
        this.darkMode = true;
        this.lightsGone = true;
        
        // Turn lights off permanently
        this.body.classList.add('dark-mode');
        this.flashlightOverlay.classList.add('active');
        
        // Make button fall down and disappear
        this.easierButton.classList.add('button-falling');
        
        // After animation completes, replace with "bwahaha"
        setTimeout(() => {
            this.easierButton.style.display = 'none';
            
            // Create evil laugh text
            const bwahaha = document.createElement('div');
            bwahaha.className = 'bwahaha';
            bwahaha.textContent = 'bwahaha...';
            
            // Insert it where the button was
            this.controls.appendChild(bwahaha);
        }, 1500);
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
            square.style.backgroundColor = i === this.correctIndex ? this.differentColor : this.baseColor;
            square.textContent = i; // Number from 1 to 16
            
            square.addEventListener('click', () => this.check(i, square));
            this.grid.appendChild(square);
        }
    }
    
    check(index, square) {
        if (this.gameOver) return;
        
        const isCorrectColor = (index === this.correctIndex);
        
        console.log('Correct is:', this.correctIndex);
             
        // EVIL: Always say it's wrong, even if they pick the right color
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
        
        // Disable buttons
        this.newButton.disabled = true;
        this.newButton.style.background = '#ccc';
        this.newButton.style.cursor = 'not-allowed';
        
        if (!this.lightsGone) {
            this.easierButton.disabled = true;
            this.easierButton.style.background = '#ccc';
            this.easierButton.style.cursor = 'not-allowed';
        }
    }
}

new ColorGame();