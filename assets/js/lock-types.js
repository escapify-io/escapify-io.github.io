class LockTypes {
    static TYPES = {
        NUMERIC: {
            id: 'numeric',
            name: 'Numérico',
            icon: 'fas fa-hashtag',
            description: 'Candado con código numérico',
            minLength: 4,
            maxLength: 8,
            template: 'numeric-template',
            difficulty: 'easy'
        },
        ALPHANUMERIC: {
            id: 'alphanumeric',
            name: 'Alfanumérico',
            icon: 'fas fa-font',
            description: 'Candado con letras y números',
            minLength: 4,
            maxLength: 8,
            template: 'alphanumeric-template',
            difficulty: 'medium'
        },
        DIRECTIONAL_4: {
            id: 'directional-4',
            name: 'Direccional (4)',
            icon: 'fas fa-arrows-alt',
            description: 'Candado con 4 direcciones',
            directions: ['⬆️', '⬇️', '⬅️', '➡️'],
            template: 'directional-template',
            minLength: 3,
            maxLength: 10,
            difficulty: 'medium'
        },
        DIRECTIONAL_8: {
            id: 'directional-8',
            name: 'Direccional (8)',
            icon: 'fas fa-compass',
            description: 'Candado con 8 direcciones',
            directions: ['⬆️', '⬇️', '⬅️', '➡️', '↖️', '↗️', '↙️', '↘️'],
            template: 'directional-template',
            minLength: 4,
            maxLength: 12,
            difficulty: 'hard'
        },
        COLOR: {
            id: 'color',
            name: 'Color',
            icon: 'fas fa-palette',
            description: 'Candado de colores',
            colors: ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
            template: 'color-template',
            minLength: 3,
            maxLength: 6,
            difficulty: 'easy'
        },
        PATTERN_9: {
            id: 'pattern-9',
            name: 'Patrón (9 puntos)',
            icon: 'fas fa-th',
            description: 'Patrón de 9 puntos',
            gridSize: 3,
            template: 'pattern-template',
            difficulty: 'medium'
        },
        PATTERN_16: {
            id: 'pattern-16',
            name: 'Patrón (16 puntos)',
            icon: 'fas fa-th-large',
            description: 'Patrón de 16 puntos',
            gridSize: 4,
            template: 'pattern-template',
            difficulty: 'hard'
        },
        COMPUTER_LOGIN: {
            id: 'computer-login',
            name: 'Login de Ordenador',
            icon: 'fas fa-laptop',
            description: 'Simula un login de ordenador',
            template: 'computer-login-template',
            difficulty: 'hard'
        },
        MUSICAL: {
            id: 'musical',
            name: 'Musical',
            icon: 'fas fa-music',
            description: 'Candado con notas musicales',
            notes: ['♪', '♫', '♬', '♩', '♭', '♮', '♯'],
            template: 'musical-template',
            minLength: 3,
            maxLength: 6,
            difficulty: 'medium'
        },
        EMOJI: {
            id: 'emoji',
            name: 'Emoji',
            icon: 'fas fa-smile',
            description: 'Candado con emojis',
            emojis: ['😀', '😎', '🤖', '👻', '🎮', '🎲', '🎯', '🎨'],
            template: 'emoji-template',
            minLength: 3,
            maxLength: 6,
            difficulty: 'easy'
        },
        NOKIA: {
            id: 'nokia',
            name: 'Teclado Nokia',
            icon: 'fas fa-mobile-alt',
            description: 'Candado con teclado tradicional de teléfono móvil',
            minLength: 4,
            maxLength: 8,
            template: 'nokia-template',
            keyMapping: {
                '1': ['1'],
                '2': ['A', 'B', 'C', '2'],
                '3': ['D', 'E', 'F', '3'],
                '4': ['G', 'H', 'I', '4'],
                '5': ['J', 'K', 'L', '5'],
                '6': ['M', 'N', 'O', '6'],
                '7': ['P', 'Q', 'R', 'S', '7'],
                '8': ['T', 'U', 'V', '8'],
                '9': ['W', 'X', 'Y', 'Z', '9'],
                '0': ['0', ' '],
                '*': ['*'],
                '#': ['#']
            },
            difficulty: 'medium'
        },
        COORDINATES: {
            id: 'coordinates',
            name: 'Coordenadas',
            icon: 'fas fa-map-marker-alt',
            description: 'Candado con coordenadas geográficas en un mapa',
            template: 'coordinates-template',
            difficulty: 'hard'
        },
        WORD_WHEEL: {
            id: 'word-wheel',
            name: 'Palabra giratoria',
            icon: 'fas fa-spell-check',
            description: 'Alinea las ruedas de letras para formar la palabra correcta',
            template: 'word-wheel-template',
            slots: 5,
            minLength: 4,
            maxLength: 8,
            difficulty: 'medium'
        },
        SWITCHES: {
            id: 'switches',
            name: 'Palancas binarias',
            icon: 'fas fa-toggle-on',
            description: 'Configura la combinación correcta de palancas activadas y desactivadas',
            template: 'switches-template',
            switches: 5,
            minLength: 4,
            maxLength: 8,
            difficulty: 'easy'
        },
        SLIDER: {
            id: 'slider',
            name: 'Deslizadores',
            icon: 'fas fa-sliders-h',
            description: 'Ajusta cada deslizador hasta alcanzar la combinación correcta',
            template: 'slider-template',
            sliders: 4,
            min: 0,
            max: 9,
            minLength: 3,
            maxLength: 6,
            difficulty: 'medium'
        },
        CRYPTEX: {
            id: 'cryptex',
            name: 'Cryptex',
            icon: 'fas fa-ring',
            description: 'Ruedas giratorias con letras para descubrir una palabra secreta',
            template: 'cryptex-template',
            minLength: 4,
            maxLength: 8,
            difficulty: 'hard'
        },
        ROTARY: {
            id: 'rotary',
            name: 'Mando giratorio',
            icon: 'fas fa-bullseye',
            description: 'Simula el dial de una caja fuerte con giros izquierda/derecha',
            template: 'rotary-template',
            minLength: 3,
            maxLength: 5,
            difficulty: 'medium'
        }
    };

    static resolveType(typeId) {
        if (!typeId) return null;
        const normalized = typeId.replace(/-/g, '_').toUpperCase();
        return this.TYPES[normalized] || Object.values(this.TYPES).find(type => type.id === typeId);
    }

    static getTemplate(typeId, customOptions = {}) {
        const baseType = this.resolveType(typeId);
        if (!baseType) return null;
        const type = { ...baseType, options: customOptions || {} };

        switch (type.template) {
            case 'numeric-template':
                return this.createNumericTemplate(type);
            case 'alphanumeric-template':
                return this.createAlphanumericTemplate(type);
            case 'directional-template':
                return this.createDirectionalTemplate(type);
            case 'color-template':
                return this.createColorTemplate(type);
            case 'pattern-template':
                return this.createPatternTemplate(type);
            case 'computer-login-template':
                return this.createComputerLoginTemplate(type);
            case 'musical-template':
                return this.createMusicalTemplate(type);
            case 'emoji-template':
                return this.createEmojiTemplate(type);
            case 'nokia-template':
                return this.createNokiaTemplate(type);
            case 'coordinates-template':
                return this.createCoordinatesTemplate(type);
            case 'word-wheel-template':
                return this.createWordWheelTemplate(type);
            case 'switches-template':
                return this.createSwitchesTemplate(type);
            case 'slider-template':
                return this.createSliderTemplate(type);
            case 'cryptex-template':
                return this.createCryptexTemplate(type);
            case 'rotary-template':
                return this.createRotaryTemplate(type);
            default:
                return null;
        }
    }

    static createNumericTemplate(type) {
        const options = type.options || {};
        const container = document.createElement('div');
        container.className = 'lock-keypad numeric-keypad';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridTemplateRows = 'repeat(4, 1fr)';
        container.style.gap = '10px';
        
        const digitOrderValue = options.digitOrder || '789456123';
        const isReversed = digitOrderValue === '123456789';
        
        const buttonOrder = isReversed
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '']
            : [7, 8, 9, 4, 5, 6, 1, 2, 3, '', 0, ''];
        
        buttonOrder.forEach(num => {
            if (num === '') {
                const spacer = document.createElement('div');
                container.appendChild(spacer);
                return;
            }
            const button = document.createElement('button');
            button.className = 'keypad-button';
            button.textContent = num.toString();
            button.dataset.value = num.toString();
            if (num === 0) {
                button.style.gridColumn = '2';
            }
            container.appendChild(button);
        });
        
        const allowDelete = options.allowDelete !== undefined ? options.allowDelete : true;
        if (allowDelete) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'keypad-button delete-button';
            deleteButton.innerHTML = '<i class="fas fa-backspace"></i>';
            deleteButton.dataset.action = 'delete';
            deleteButton.setAttribute('aria-label', 'Borrar último dígito');
            container.appendChild(deleteButton);
        }
        
        return container;
    }

    static createAlphanumericTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad alphanumeric-keypad';
        container.style.gridTemplateColumns = 'repeat(6, 1fr)';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        characters.split('').forEach(char => {
            const button = document.createElement('button');
            button.className = 'keypad-button';
            button.textContent = char;
            button.dataset.value = char;
            container.appendChild(button);
        });

        return container;
    }

    static createDirectionalTemplate(type) {
        const options = type.options || {};
        const maxLength = options.codeLength || type.maxLength || Math.min(8, type.directions.length * 2);
        const container = document.createElement('div');
        container.className = 'directional-keypad';
        container.setAttribute('aria-label', 'Candado direccional');
        
        const helper = document.createElement('p');
        helper.className = 'directional-helper';
        helper.textContent = `Selecciona hasta ${maxLength} direcciones y confirma la secuencia.`;
        container.appendChild(helper);

        const memoryContainer = document.createElement('div');
        memoryContainer.className = 'directional-memory';
        memoryContainer.setAttribute('aria-live', 'polite');
        container.appendChild(memoryContainer);

        const grid = document.createElement('div');
        grid.className = 'directional-grid';
        const gridSize = Math.ceil(Math.sqrt(type.directions.length));
        grid.style.gridTemplateColumns = `repeat(${gridSize}, minmax(50px, 1fr))`;
        container.appendChild(grid);

        const sequence = [];

        type.directions.forEach(direction => {
            const button = document.createElement('button');
            button.className = 'directional-button';
            button.dataset.value = direction;
            button.textContent = direction;
            button.setAttribute('aria-label', `Agregar ${direction}`);
            button.addEventListener('click', () => {
                if (sequence.length >= maxLength) {
                    helper.textContent = `Has alcanzado el máximo de ${maxLength} pasos. Usa borrar para corregir.`;
                    return;
                }
                sequence.push(direction);
                renderSequence();
            });
            grid.appendChild(button);
        });

        const actions = document.createElement('div');
        actions.className = 'directional-actions';

        const undoButton = document.createElement('button');
        undoButton.className = 'btn btn-secondary';
        undoButton.innerHTML = '<i class="fas fa-backspace"></i> Borrar último';
        undoButton.addEventListener('click', () => {
            sequence.pop();
            renderSequence();
        });

        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-secondary';
        clearButton.innerHTML = '<i class="fas fa-eraser"></i> Limpiar';
        clearButton.addEventListener('click', () => {
            sequence.length = 0;
            renderSequence();
        });

        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.innerHTML = '<i class="fas fa-check"></i> Confirmar';
        confirmButton.addEventListener('click', () => {
            if (sequence.length === 0) {
                helper.textContent = 'Añade al menos una dirección antes de confirmar.';
                return;
            }
            const event = new CustomEvent('codeEntered', { detail: sequence.join('-') });
            container.dispatchEvent(event);
        });

        actions.appendChild(undoButton);
        actions.appendChild(clearButton);
        actions.appendChild(confirmButton);
        container.appendChild(actions);

        function renderSequence() {
            helper.textContent = `Selecciona hasta ${maxLength} direcciones (actual: ${sequence.length}).`;
            memoryContainer.innerHTML = '';
            if (sequence.length === 0) {
                // No mostrar nada cuando está vacío - el placeholder ya está en el helper
                memoryContainer.style.display = 'none';
                return;
            }
            memoryContainer.style.display = 'flex';
            sequence.forEach(direction => {
                const step = document.createElement('span');
                step.className = 'directional-step';
                step.textContent = direction;
                memoryContainer.appendChild(step);
            });
        }

        renderSequence();
        return container;
    }

    static createColorTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad color-keypad';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';

        type.colors.forEach(color => {
            const button = document.createElement('button');
            button.className = 'keypad-button color-button';
            button.textContent = color;
            button.dataset.value = color;
            container.appendChild(button);
        });

        return container;
    }

    static createPatternTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad pattern-keypad';
        container.style.gridTemplateColumns = `repeat(${type.gridSize}, 1fr)`;

        for (let i = 0; i < type.gridSize * type.gridSize; i++) {
            const button = document.createElement('button');
            button.className = 'keypad-button pattern-button';
            button.dataset.value = i.toString();
            container.appendChild(button);
        }

        return container;
    }

    static createComputerLoginTemplate(type) {
        const container = document.createElement('div');
        container.className = 'computer-login-container';
        
        // Crear el sistema operativo simulado
        container.innerHTML = `
            <div class="login-screen">
                <div class="login-header">
                    <div class="os-logo">
                        <i class="fas fa-laptop"></i>
                    </div>
                    <h2 class="os-name">Sistema Operativo</h2>
                    <div class="os-version">Versión 2.0</div>
                </div>
                
                <div class="login-form">
                    <div class="input-group">
                        <label for="username">
                            <i class="fas fa-user"></i>
                            Usuario
                        </label>
                        <div class="input-wrapper">
                            <input type="text" id="username" placeholder="Introduce el usuario" autocomplete="off">
                            <div class="typing-effect"></div>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label for="password">
                            <i class="fas fa-lock"></i>
                            Contraseña
                        </label>
                        <div class="input-wrapper">
                            <input type="password" id="password" placeholder="••••••••" autocomplete="off">
                            <div class="typing-effect"></div>
                            <button class="toggle-password" aria-label="Mostrar/Ocultar contraseña">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div class="login-status">
                        <div class="status-icon"></div>
                        <div class="status-message"></div>
                    </div>

                    <button class="login-button">
                        <span class="button-text">Iniciar Sesión</span>
                        <div class="loading-spinner"></div>
                    </button>

                    <div class="login-attempts">
                        <div class="attempts-bar">
                            <div class="attempts-progress"></div>
                        </div>
                        <div class="attempts-text">Intentos restantes: <span>3</span></div>
                    </div>
                </div>

                <div class="login-footer">
                    <div class="system-time">00:00</div>
                    <div class="system-status">
                        <i class="fas fa-wifi"></i>
                        <i class="fas fa-battery-full"></i>
                    </div>
                </div>
            </div>
        `;

        // Variables de estado
        let attempts = 3;
        let isLoggingIn = false;
        let currentUsername = '';
        let currentPassword = '';

        // Elementos del DOM
        const usernameInput = container.querySelector('#username');
        const passwordInput = container.querySelector('#password');
        const loginButton = container.querySelector('.login-button');
        const statusIcon = container.querySelector('.status-icon');
        const statusMessage = container.querySelector('.status-message');
        const attemptsProgress = container.querySelector('.attempts-progress');
        const attemptsText = container.querySelector('.attempts-text span');
        const togglePassword = container.querySelector('.toggle-password');
        const systemTime = container.querySelector('.system-time');

        // Sonidos
        const sounds = {
            type: new Audio('assets/sounds/keyboard-type.mp3'),
            login: new Audio('assets/sounds/login-attempt.mp3'),
            success: new Audio('assets/sounds/login-success.mp3'),
            error: new Audio('assets/sounds/login-error.mp3'),
            hack: new Audio('assets/sounds/hack-attempt.mp3')
        };

        // Efecto de escritura
        function simulateTyping(input, text, callback) {
            let index = 0;
            input.value = '';
            input.focus();
            
            const interval = setInterval(() => {
                if (index < text.length) {
                    input.value += text[index];
                    sounds.type.currentTime = 0;
                    sounds.type.play();
                    index++;
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, 100);
        }

        // Actualizar intentos
        function updateAttempts() {
            attempts--;
            attemptsText.textContent = attempts;
            attemptsProgress.style.width = `${(attempts / 3) * 100}%`;
            
            if (attempts === 0) {
                loginButton.disabled = true;
                statusMessage.textContent = 'Sistema bloqueado por seguridad';
                statusIcon.className = 'status-icon error';
                sounds.error.play();
                
                // Simular hackeo
                setTimeout(() => {
                    container.classList.add('hacking');
                    sounds.hack.play();
                    
                    // Efecto de hackeo
                    const hackInterval = setInterval(() => {
                        usernameInput.value = Math.random().toString(36).substring(7);
                        passwordInput.value = Math.random().toString(36).substring(7);
                    }, 100);
                    
                    setTimeout(() => {
                        clearInterval(hackInterval);
                        container.classList.remove('hacking');
                        resetLogin();
                    }, 3000);
                }, 2000);
            }
        }

        // Resetear login
        function resetLogin() {
            attempts = 3;
            attemptsText.textContent = attempts;
            attemptsProgress.style.width = '100%';
            loginButton.disabled = false;
            statusMessage.textContent = '';
            statusIcon.className = 'status-icon';
            usernameInput.value = '';
            passwordInput.value = '';
            container.classList.remove('error', 'success');
        }

        // Actualizar hora del sistema
        function updateSystemTime() {
            const now = new Date();
            systemTime.textContent = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Event Listeners
        usernameInput.addEventListener('input', (e) => {
            currentUsername = e.target.value;
            statusMessage.textContent = '';
            statusIcon.className = 'status-icon';
        });

        passwordInput.addEventListener('input', (e) => {
            currentPassword = e.target.value;
            statusMessage.textContent = '';
            statusIcon.className = 'status-icon';
        });

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.innerHTML = `<i class="fas fa-eye${type === 'password' ? '' : '-slash'}"></i>`;
        });

        loginButton.addEventListener('click', async () => {
            if (isLoggingIn) return;
            
            isLoggingIn = true;
            loginButton.classList.add('loading');
            sounds.login.play();
            
            // Simular proceso de login
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const code = `${currentUsername}:${currentPassword}`;
            const event = new CustomEvent('codeEntered', { detail: code });
            container.dispatchEvent(event);
            
            if (code === container.dataset.correctCode) {
                statusIcon.className = 'status-icon success';
                statusMessage.textContent = 'Acceso concedido';
                container.classList.add('success');
                sounds.success.play();
                
                // Simular inicio de sesión exitoso
                setTimeout(() => {
                    container.classList.add('logged-in');
                }, 1000);
            } else {
                statusIcon.className = 'status-icon error';
                statusMessage.textContent = 'Credenciales incorrectas';
                container.classList.add('error');
                sounds.error.play();
                updateAttempts();
            }
            
            isLoggingIn = false;
            loginButton.classList.remove('loading');
        });

        // Inicializar
        updateSystemTime();
        setInterval(updateSystemTime, 1000);

        return container;
    }

    static createMusicalTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad musical-keypad';
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';

        type.notes.forEach(note => {
            const button = document.createElement('button');
            button.className = 'keypad-button musical-button';
            button.textContent = note;
            button.dataset.value = note;
            container.appendChild(button);
        });

        return container;
    }

    static createEmojiTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad emoji-keypad';
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';

        type.emojis.forEach(emoji => {
            const button = document.createElement('button');
            button.className = 'keypad-button emoji-button';
            button.textContent = emoji;
            button.dataset.value = emoji;
            container.appendChild(button);
        });

        return container;
    }

    static createNokiaTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad nokia-keypad';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridTemplateRows = 'repeat(4, 1fr)';
        container.style.gap = '10px';
        
        // Comprobar si hay opciones guardadas
        const options = type.options || {};
        const nokiaSpeed = options.nokiaSpeed || 'medium';
        const showLetters = options.showLetters !== undefined ? options.showLetters : true;
        const playSounds = options.playSounds !== undefined ? options.playSounds : false;
        const vibrate = options.vibrate !== undefined ? options.vibrate : false;
        
        // Determinar velocidad en milisegundos según la opción
        let entryTimeout = 1500; // Por defecto, velocidad media
        if (nokiaSpeed === 'fast') entryTimeout = 1000;
        if (nokiaSpeed === 'slow') entryTimeout = 2000;
        
        // Layout teclado tradicional: 123, 456, 789, *0#
        const buttonOrder = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
        
        // Crear el display de texto actual
        const displayContainer = document.createElement('div');
        displayContainer.className = 'nokia-display';
        displayContainer.style.gridColumn = '1 / span 3';
        displayContainer.style.marginBottom = '15px';
        displayContainer.style.padding = '10px';
        displayContainer.style.backgroundColor = '#a4c9a4'; // Color verde clásico de pantallas Nokia
        displayContainer.style.color = '#222';
        displayContainer.style.fontFamily = 'monospace';
        displayContainer.style.textAlign = 'center';
        displayContainer.style.borderRadius = '4px';
        displayContainer.style.minHeight = '40px';
        
        const currentChar = document.createElement('div');
        currentChar.className = 'nokia-current-char';
        currentChar.textContent = '';
        currentChar.style.fontSize = '1.2rem';
        
        const currentKey = document.createElement('div');
        currentKey.className = 'nokia-current-key';
        currentKey.textContent = '';
        currentKey.style.fontSize = '0.8rem';
        currentKey.style.opacity = '0.7';
        
        displayContainer.appendChild(currentChar);
        displayContainer.appendChild(currentKey);
        container.appendChild(displayContainer);
        
        // Crear los botones del teclado
        buttonOrder.forEach(num => {
            const button = document.createElement('button');
            button.className = 'keypad-button nokia-button';
            button.textContent = num;
            button.dataset.key = num;
            
            // Agregar las letras debajo de los números si está habilitada la opción
            if (showLetters && type.keyMapping[num] && type.keyMapping[num].length > 1) {
                const letters = document.createElement('small');
                letters.style.display = 'block';
                letters.style.fontSize = '0.7rem';
                letters.style.marginTop = '2px';
                letters.style.opacity = '0.7';
                letters.textContent = type.keyMapping[num].join('');
                button.appendChild(letters);
            }
            
            container.appendChild(button);
        });
        
        // Variables para manejar la entrada de texto estilo T9
        let currentKeyIndex = -1;
        let currentKeyValue = null;
        let lastKeyPressTime = 0;
        let keyPressFunctionId = null;
        let enteredCode = '';
        
        // Sonidos para el candado
        const sounds = {
            keypress: new Audio('assets/sounds/nokia-keypress.mp3'),
            confirm: new Audio('assets/sounds/nokia-confirm.mp3')
        };
        
        // Crear el botón de confirmación
        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.gridColumn = '1 / span 3';
        confirmButton.style.marginTop = '15px';
        container.appendChild(confirmButton);
        
        // Crear el botón de borrar
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-secondary';
        deleteButton.innerHTML = '<i class="fas fa-backspace"></i> Borrar';
        deleteButton.style.gridColumn = '1 / span 3';
        deleteButton.style.marginTop = '10px';
        container.appendChild(deleteButton);
        
        // Event listeners para los botones
        const buttons = container.querySelectorAll('.nokia-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const key = button.dataset.key;
                const now = new Date().getTime();
                const keyMapping = type.keyMapping[key];
                
                // Reproducir sonido si está habilitado
                if (playSounds) {
                    sounds.keypress.currentTime = 0;
                    sounds.keypress.play();
                }
                
                // Vibrar si está habilitado y es compatible
                if (vibrate && navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                // Si es la misma tecla y no ha pasado mucho tiempo
                if (key === currentKeyValue && now - lastKeyPressTime < entryTimeout) {
                    // Incrementar el índice para rotar por los caracteres disponibles
                    currentKeyIndex = (currentKeyIndex + 1) % keyMapping.length;
                    currentChar.textContent = keyMapping[currentKeyIndex];
                } else {
                    // Nueva tecla o ha pasado mucho tiempo
                    currentKeyValue = key;
                    currentKeyIndex = 0;
                    currentChar.textContent = keyMapping[currentKeyIndex];
                }
                
                // Actualizar la pantalla
                currentKey.textContent = `(${key})`;
                lastKeyPressTime = now;
                
                // Limpiar el timeout anterior si existe
                if (keyPressFunctionId) clearTimeout(keyPressFunctionId);
                
                // Configurar un nuevo timeout para confirmar el carácter después de un tiempo
                keyPressFunctionId = setTimeout(() => {
                    if (currentChar.textContent) {
                        enteredCode += currentChar.textContent;
                        // Disparar evento para notificar entrada de código
                        const event = new CustomEvent('characterEntered', { 
                            detail: { code: enteredCode, character: currentChar.textContent }
                        });
                        container.dispatchEvent(event);
                        
                        // Limpiar el estado actual
                        currentChar.textContent = '';
                        currentKey.textContent = '';
                        currentKeyValue = null;
                    }
                }, entryTimeout);
            });
        });
        
        // Event listener para botón de confirmación
        confirmButton.addEventListener('click', () => {
            // Si hay un carácter pendiente, añadirlo primero
            if (currentChar.textContent) {
                enteredCode += currentChar.textContent;
                
                // Limpiar el estado actual
                currentChar.textContent = '';
                currentKey.textContent = '';
                currentKeyValue = null;
                if (keyPressFunctionId) clearTimeout(keyPressFunctionId);
            }
            
            // Reproducir sonido si está habilitado
            if (playSounds) {
                sounds.confirm.currentTime = 0;
                sounds.confirm.play();
            }
            
            // Vibrar si está habilitado y es compatible
            if (vibrate && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Enviar el código completo
            const event = new CustomEvent('codeEntered', { detail: enteredCode });
            container.dispatchEvent(event);
            
            // Mostrar el código en la pantalla durante un momento
            displayContainer.innerHTML = `<div style="font-size: 1.2rem; padding: 5px;">Código: ${enteredCode}</div>`;
            setTimeout(() => {
                displayContainer.innerHTML = '';
                displayContainer.appendChild(currentChar);
                displayContainer.appendChild(currentKey);
            }, 2000);
        });
        
        // Event listener para borrar
        deleteButton.addEventListener('click', () => {
            if (currentChar.textContent) {
                // Borrar el carácter actual que se está introduciendo
                currentChar.textContent = '';
                currentKey.textContent = '';
                currentKeyValue = null;
                if (keyPressFunctionId) clearTimeout(keyPressFunctionId);
            } else if (enteredCode.length > 0) {
                // Borrar el último carácter
                enteredCode = enteredCode.slice(0, -1);
                // Mostrar feedback
                displayContainer.innerHTML = `<div style="font-size: 1.2rem; padding: 5px;">Borrado: ${enteredCode}</div>`;
                setTimeout(() => {
                    displayContainer.innerHTML = '';
                    displayContainer.appendChild(currentChar);
                    displayContainer.appendChild(currentKey);
                }, 1000);
            }
        });
        
        return container;
    }

    static createCoordinatesTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad coordinates-keypad';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '15px';
        
        // Comprobar si hay opciones guardadas
        const options = type.options || {};
        const mapStyle = options.mapStyle || 'streets';
        const precision = options.precision || 'medium';
        const showMarker = options.showMarker !== undefined ? options.showMarker : true;
        const showRadius = options.showRadius !== undefined ? options.showRadius : false;
        
        // Determinar la precisión en decimales según la opción
        let decimalPrecision = 4; // Por defecto, precisión media
        if (precision === 'high') decimalPrecision = 6;
        if (precision === 'low') decimalPrecision = 2;
        
        // Contenedor para el mapa
        const mapContainer = document.createElement('div');
        mapContainer.className = 'map-container';
        mapContainer.style.height = '300px';
        mapContainer.style.border = '1px solid var(--border-color)';
        mapContainer.style.borderRadius = '8px';
        mapContainer.style.overflow = 'hidden';
        mapContainer.id = 'map-container';
        
        // Campos para coordenadas
        const coordinatesContainer = document.createElement('div');
        coordinatesContainer.className = 'coordinates-inputs';
        coordinatesContainer.style.display = 'grid';
        coordinatesContainer.style.gridTemplateColumns = '1fr 1fr';
        coordinatesContainer.style.gap = '10px';
        
        // Campo para latitud
        const latitudeGroup = document.createElement('div');
        latitudeGroup.className = 'input-group';
        
        const latLabel = document.createElement('label');
        latLabel.textContent = 'Latitud:';
        latLabel.htmlFor = 'latitude-input';
        
        const latInput = document.createElement('input');
        latInput.id = 'latitude-input';
        latInput.type = 'number';
        latInput.step = `0.${'0'.repeat(decimalPrecision-1)}1`;
        latInput.placeholder = `41.${'0'.repeat(decimalPrecision-1)}1`;
        
        latitudeGroup.appendChild(latLabel);
        latitudeGroup.appendChild(latInput);
        
        // Campo para longitud
        const longitudeGroup = document.createElement('div');
        longitudeGroup.className = 'input-group';
        
        const lngLabel = document.createElement('label');
        lngLabel.textContent = 'Longitud:';
        lngLabel.htmlFor = 'longitude-input';
        
        const lngInput = document.createElement('input');
        lngInput.id = 'longitude-input';
        lngInput.type = 'number';
        lngInput.step = `0.${'0'.repeat(decimalPrecision-1)}1`;
        lngInput.placeholder = `2.${'0'.repeat(decimalPrecision-1)}1`;
        
        longitudeGroup.appendChild(lngLabel);
        longitudeGroup.appendChild(lngInput);
        
        coordinatesContainer.appendChild(latitudeGroup);
        coordinatesContainer.appendChild(longitudeGroup);
        
        // Botón de búsqueda
        const searchButton = document.createElement('button');
        searchButton.className = 'btn btn-secondary';
        searchButton.innerHTML = '<i class="fas fa-search"></i> Buscar lugar';
        searchButton.style.marginBottom = '10px';
        
        // Botón de confirmación
        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.textContent = 'Confirmar coordenadas';
        
        // Mensaje informativo
        const infoMessage = document.createElement('p');
        infoMessage.className = 'info-message';
        infoMessage.textContent = 'Puedes hacer clic en el mapa para seleccionar un punto o introducir coordenadas manualmente.';
        infoMessage.style.fontSize = '0.9rem';
        infoMessage.style.color = 'var(--text-color-light)';
        infoMessage.style.marginTop = '5px';
        
        // Armar el contenedor principal
        container.appendChild(mapContainer);
        container.appendChild(coordinatesContainer);
        container.appendChild(searchButton);
        container.appendChild(confirmButton);
        container.appendChild(infoMessage);
        
        // Inicializar el mapa cuando sea visible
        setTimeout(() => {
            try {
                // Verificar si Leaflet está disponible
                if (typeof L !== 'undefined') {
                    const map = L.map(mapContainer.id).setView([40.416775, -3.703790], 6); // Vista inicial de España
                    
                    // Seleccionar la capa de mapa según la opción elegida
                    let tileLayer;
                    
                    switch (mapStyle) {
                        case 'satellite':
                            tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                                maxZoom: 19
                            });
                            break;
                        case 'terrain':
                            tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
                                maxZoom: 17
                            });
                            break;
                        default: // 'streets'
                            tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                maxZoom: 19
                            });
                    }
                    
                    tileLayer.addTo(map);
                    
                    // Variable para guardar el marcador actual
                    let currentMarker = null;
                    let radiusCircle = null;
                    
                    // Función para actualizar el marcador
                    function updateMarker(latlng) {
                        // Actualizar inputs con las coordenadas según la precisión configurada
                        latInput.value = latlng.lat.toFixed(decimalPrecision);
                        lngInput.value = latlng.lng.toFixed(decimalPrecision);
                        
                        // Actualizar o crear el marcador si está habilitado
                        if (showMarker) {
                            if (currentMarker) {
                                currentMarker.setLatLng(latlng);
                            } else {
                                currentMarker = L.marker(latlng).addTo(map);
                            }
                            
                            // Mostrar el radio de aceptación si está habilitado
                            if (showRadius) {
                                const radius = 100; // 100 metros de radio
                                if (radiusCircle) {
                                    radiusCircle.setLatLng(latlng);
                                } else {
                                    radiusCircle = L.circle(latlng, {
                                        radius: radius,
                                        color: 'var(--primary-color)',
                                        fillColor: 'var(--primary-color)',
                                        fillOpacity: 0.2
                                    }).addTo(map);
                                }
                            } else if (radiusCircle) {
                                map.removeLayer(radiusCircle);
                                radiusCircle = null;
                            }
                        } else if (currentMarker) {
                            map.removeLayer(currentMarker);
                            currentMarker = null;
                            
                            if (radiusCircle) {
                                map.removeLayer(radiusCircle);
                                radiusCircle = null;
                            }
                        }
                    }
                    
                    // Event listener para clicks en el mapa
                    map.on('click', (e) => {
                        updateMarker(e.latlng);
                    });
                    
                    // Event listener para cambios en los inputs
                    latInput.addEventListener('input', updateCoordinates);
                    lngInput.addEventListener('input', updateCoordinates);
                    
                    function updateCoordinates() {
                        const lat = parseFloat(latInput.value);
                        const lng = parseFloat(lngInput.value);
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                            const latlng = L.latLng(lat, lng);
                            updateMarker(latlng);
                            map.panTo(latlng);
                        }
                    }
                    
                    // Event listener para botón de búsqueda (para simular geocoding)
                    searchButton.addEventListener('click', () => {
                        // Aquí se podría implementar una búsqueda real con un geocoding API
                        // Por ahora, simularemos un resultado aleatorio
                        const randomLat = 35 + Math.random() * 15; // Entre 35 y 50 (Europa aprox.)
                        const randomLng = -10 + Math.random() * 30; // Entre -10 y 20
                        
                        const latlng = L.latLng(randomLat, randomLng);
                        updateMarker(latlng);
                        map.setView(latlng, 10);
                    });
                    
                    // Event listener para botón de confirmación
                    confirmButton.addEventListener('click', () => {
                        const lat = parseFloat(latInput.value);
                        const lng = parseFloat(lngInput.value);
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                            const coordinate = `${lat.toFixed(decimalPrecision)},${lng.toFixed(decimalPrecision)}`;
                            const event = new CustomEvent('codeEntered', { detail: coordinate });
                            container.dispatchEvent(event);
                        } else {
                            infoMessage.textContent = 'Por favor, selecciona una ubicación válida.';
                            infoMessage.style.color = 'var(--error-color)';
                        }
                    });
                    
                } else {
                    // Si Leaflet no está disponible, mostrar un mensaje de error
                    mapContainer.innerHTML = `
                        <div style="height:100%; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px;">
                            <p>No se ha podido cargar el mapa. Por favor, asegúrate de incluir la librería Leaflet:</p>
                            <pre style="background:#f5f5f5; padding:10px; margin-top:10px; text-align:left;">
&lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" /&gt;
&lt;script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"&gt;&lt;/script&gt;
                            </pre>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error al inicializar el mapa:', error);
                mapContainer.innerHTML = `
                    <div style="height:100%; display:flex; align-items:center; justify-content:center;">
                        <p>Error al cargar el mapa: ${error.message}</p>
                    </div>
                `;
            }
        }, 500); // Pequeño retraso para asegurarnos de que el componente ya está en el DOM
        
        return container;
    }

    static createWordWheelTemplate(type) {
        const options = type.options || {};
        const slots = options.codeLength || options.slots || type.slots || 5;
        const alphabet = (options.alphabet || type.alphabet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');
        const container = document.createElement('div');
        container.className = 'word-wheel-lock';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '1rem';

        const title = document.createElement('p');
        title.textContent = 'Gira las ruedas para formar la palabra';
        title.style.fontWeight = '600';
        title.style.margin = '0';
        container.appendChild(title);

        const currentWord = document.createElement('div');
        currentWord.className = 'word-wheel-display';
        currentWord.style.fontSize = '1.5rem';
        currentWord.style.letterSpacing = '0.2rem';
        currentWord.style.fontFamily = 'monospace';
        container.appendChild(currentWord);

        const wheelsWrapper = document.createElement('div');
        wheelsWrapper.className = 'word-wheel-wrapper';
        wheelsWrapper.style.display = 'flex';
        wheelsWrapper.style.gap = '0.5rem';
        container.appendChild(wheelsWrapper);

        const currentLetters = Array(slots).fill(alphabet[0]);

        const emitCode = () => {
            const word = currentLetters.join('');
            currentWord.textContent = word;
            container.dispatchEvent(new CustomEvent('codeEntered', { detail: word }));
        };

        for (let i = 0; i < slots; i++) {
            const column = document.createElement('div');
            column.className = 'word-wheel-column';
            column.style.display = 'flex';
            column.style.flexDirection = 'column';
            column.style.alignItems = 'center';
            column.style.gap = '0.25rem';

            const upBtn = document.createElement('button');
            upBtn.className = 'wheel-btn';
            upBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            upBtn.style.padding = '0.4rem';
            upBtn.style.borderRadius = '50%';
            upBtn.style.border = '1px solid var(--border-color)';
            upBtn.style.background = 'var(--card-bg)';
            upBtn.addEventListener('click', () => {
                const currentIndex = alphabet.indexOf(currentLetters[i]);
                const nextIndex = (currentIndex + 1) % alphabet.length;
                currentLetters[i] = alphabet[nextIndex];
                letterDisplay.textContent = currentLetters[i];
                emitCode();
            });

            const letterDisplay = document.createElement('div');
            letterDisplay.className = 'wheel-letter';
            letterDisplay.textContent = currentLetters[i];
            letterDisplay.style.width = '3rem';
            letterDisplay.style.height = '3rem';
            letterDisplay.style.display = 'flex';
            letterDisplay.style.alignItems = 'center';
            letterDisplay.style.justifyContent = 'center';
            letterDisplay.style.borderRadius = '10px';
            letterDisplay.style.background = 'var(--subtle-bg)';
            letterDisplay.style.fontSize = '1.2rem';
            letterDisplay.style.fontWeight = '700';

            const downBtn = document.createElement('button');
            downBtn.className = 'wheel-btn';
            downBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            downBtn.style.padding = '0.4rem';
            downBtn.style.borderRadius = '50%';
            downBtn.style.border = '1px solid var(--border-color)';
            downBtn.style.background = 'var(--card-bg)';
            downBtn.addEventListener('click', () => {
                const currentIndex = alphabet.indexOf(currentLetters[i]);
                const nextIndex = currentIndex - 1 < 0 ? alphabet.length - 1 : currentIndex - 1;
                currentLetters[i] = alphabet[nextIndex];
                letterDisplay.textContent = currentLetters[i];
                emitCode();
            });

            column.appendChild(upBtn);
            column.appendChild(letterDisplay);
            column.appendChild(downBtn);
            wheelsWrapper.appendChild(column);
        }

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Restablecer ruedas';
        resetBtn.className = 'btn btn-secondary';
        resetBtn.addEventListener('click', () => {
            for (let i = 0; i < slots; i++) {
                currentLetters[i] = alphabet[0];
            }
            wheelsWrapper.querySelectorAll('.wheel-letter').forEach(letter => {
                letter.textContent = alphabet[0];
            });
            emitCode();
        });
        container.appendChild(resetBtn);

        emitCode();
        return container;
    }

    static createSwitchesTemplate(type) {
        const options = type.options || {};
        const switchesCount = options.switches || options.codeLength || type.switches || 5;
        const container = document.createElement('div');
        container.className = 'switches-lock';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1rem';

        const info = document.createElement('p');
        info.textContent = 'Activa/desactiva las palancas para formar el patrón correcto';
        info.style.margin = '0';
        info.style.fontWeight = '500';
        container.appendChild(info);

        const switchesWrapper = document.createElement('div');
        switchesWrapper.className = 'switches-wrapper';
        switchesWrapper.style.display = 'flex';
        switchesWrapper.style.gap = '0.75rem';
        container.appendChild(switchesWrapper);

        const state = Array(switchesCount).fill(0);

        const emitState = () => {
            const code = state.join('');
            container.dispatchEvent(new CustomEvent('codeEntered', { detail: code }));
        };

        for (let i = 0; i < switchesCount; i++) {
            const button = document.createElement('button');
            button.className = 'switch-button';
            button.setAttribute('aria-pressed', 'false');
            button.textContent = 'OFF';
            button.style.padding = '0.8rem 1.2rem';
            button.style.borderRadius = '999px';
            button.style.border = '1px solid var(--border-color)';
            button.style.minWidth = '70px';
            button.style.fontWeight = '600';
            button.addEventListener('click', () => {
                state[i] = state[i] === 0 ? 1 : 0;
                const isActive = state[i] === 1;
                button.textContent = isActive ? 'ON' : 'OFF';
                button.style.background = isActive ? 'var(--secondary-color)' : 'var(--card-bg)';
                button.style.color = isActive ? '#fff' : 'var(--text-color)';
                button.setAttribute('aria-pressed', String(isActive));
                emitState();
            });
            switchesWrapper.appendChild(button);
        }

        const controls = document.createElement('div');
        controls.className = 'switch-controls';
        controls.style.display = 'flex';
        controls.style.gap = '0.5rem';
        container.appendChild(controls);

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-secondary';
        clearBtn.textContent = 'Limpiar combinación';
        clearBtn.addEventListener('click', () => {
            state.fill(0);
            switchesWrapper.querySelectorAll('.switch-button').forEach(button => {
                button.textContent = 'OFF';
                button.style.background = 'var(--card-bg)';
                button.style.color = 'var(--text-color)';
                button.setAttribute('aria-pressed', 'false');
            });
            emitState();
        });
        controls.appendChild(clearBtn);

        return container;
    }

    static createSliderTemplate(type) {
        const options = type.options || {};
        const sliders = options.sliders || options.codeLength || type.sliders || 4;
        const min = Number.isFinite(options.min) ? options.min : Number.isFinite(type.min) ? type.min : 0;
        const max = Number.isFinite(options.max) ? options.max : Number.isFinite(type.max) ? type.max : 9;
        const container = document.createElement('div');
        container.className = 'slider-lock';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '1rem';

        const intro = document.createElement('p');
        intro.textContent = 'Mueve los deslizadores para colocar cada valor en el punto exacto';
        intro.style.margin = '0';
        intro.style.fontWeight = '500';
        container.appendChild(intro);

        const slidersWrapper = document.createElement('div');
        slidersWrapper.style.display = 'flex';
        slidersWrapper.style.flexDirection = 'column';
        slidersWrapper.style.gap = '1rem';
        container.appendChild(slidersWrapper);

        const values = Array(sliders).fill(min);

        const emitValues = () => {
            const code = values.join('-');
            container.dispatchEvent(new CustomEvent('codeEntered', { detail: code }));
        };

        for (let i = 0; i < sliders; i++) {
            const group = document.createElement('div');
            group.className = 'slider-group';
            group.style.display = 'flex';
            group.style.flexDirection = 'column';
            group.style.gap = '0.5rem';

            const label = document.createElement('label');
            label.textContent = `Deslizador ${i + 1}`;
            label.style.fontWeight = '600';
            group.appendChild(label);

            const input = document.createElement('input');
            input.type = 'range';
            input.min = min;
            input.max = max;
            input.value = min;
            input.step = 1;
            input.className = 'slider-input';
            group.appendChild(input);

            const valueLabel = document.createElement('div');
            valueLabel.className = 'slider-value';
            valueLabel.textContent = min;
            valueLabel.style.alignSelf = 'flex-end';
            valueLabel.style.fontFamily = 'monospace';
            group.appendChild(valueLabel);

            input.addEventListener('input', (event) => {
                const newValue = Number(event.target.value);
                values[i] = newValue;
                valueLabel.textContent = newValue;
                emitValues();
            });

            slidersWrapper.appendChild(group);
        }

        const autoBtn = document.createElement('button');
        autoBtn.className = 'btn btn-secondary';
        autoBtn.textContent = 'Aleatorizar';
        autoBtn.addEventListener('click', () => {
            values.forEach((_, index) => {
                const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
                values[index] = randomValue;
                const slider = slidersWrapper.querySelectorAll('.slider-input')[index];
                const valueLabel = slidersWrapper.querySelectorAll('.slider-value')[index];
                slider.value = randomValue;
                valueLabel.textContent = randomValue;
            });
            emitValues();
        });
        container.appendChild(autoBtn);

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn btn-primary';
        confirmBtn.textContent = 'Confirmar valores';
        confirmBtn.addEventListener('click', emitValues);
        container.appendChild(confirmBtn);

        emitValues();
        return container;
    }


    static createCryptexTemplate(type) {
        const options = type.options || {};
        const rings = options.codeLength || options.rings || type.minLength || 4;
        const alphabet = (options.alphabet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('');

        const container = document.createElement('div');
        container.className = 'cryptex-lock';

        const info = document.createElement('p');
        info.className = 'cryptex-helper';
        info.textContent = `Configura una palabra de ${rings} letras.`;
        container.appendChild(info);

        const currentWord = document.createElement('div');
        currentWord.className = 'cryptex-current-word';
        container.appendChild(currentWord);

        const ringsWrapper = document.createElement('div');
        ringsWrapper.className = 'cryptex-rings';
        container.appendChild(ringsWrapper);

        const letters = Array(rings).fill(alphabet[0]);

        const updateWord = (dispatch = true) => {
            const word = letters.join('');
            currentWord.textContent = word;
            if (dispatch) {
                container.dispatchEvent(new CustomEvent('codeEntered', { detail: word }));
            }
        };

        for (let i = 0; i < rings; i++) {
            const ring = document.createElement('div');
            ring.className = 'cryptex-ring';

            const upBtn = document.createElement('button');
            upBtn.className = 'cryptex-btn';
            upBtn.setAttribute('aria-label', `Avanzar rueda ${i + 1}`);
            upBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';

            const letterDisplay = document.createElement('div');
            letterDisplay.className = 'cryptex-letter';
            letterDisplay.textContent = letters[i];

            const downBtn = document.createElement('button');
            downBtn.className = 'cryptex-btn';
            downBtn.setAttribute('aria-label', `Retroceder rueda ${i + 1}`);
            downBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';

            const rotate = (direction) => {
                const currentIndex = alphabet.indexOf(letters[i]);
                const offset = direction === 'up' ? 1 : -1;
                const nextIndex = (currentIndex + offset + alphabet.length) % alphabet.length;
                letters[i] = alphabet[nextIndex];
                letterDisplay.textContent = letters[i];
                updateWord();
            };

            upBtn.addEventListener('click', () => rotate('up'));
            downBtn.addEventListener('click', () => rotate('down'));

            ring.appendChild(upBtn);
            ring.appendChild(letterDisplay);
            ring.appendChild(downBtn);
            ringsWrapper.appendChild(ring);
        }

        updateWord(false);

        const confirm = document.createElement('button');
        confirm.className = 'btn btn-primary';
        confirm.innerHTML = '<i class="fas fa-check"></i> Confirmar palabra';
        confirm.addEventListener('click', () => {
            const event = new CustomEvent('codeEntered', { detail: letters.join('') });
            container.dispatchEvent(event);
        });
        container.appendChild(confirm);

        return container;
    }

    static createRotaryTemplate(type) {
        const options = type.options || {};
        const maxNumber = options.maxNumber || 39;
        const requiredSteps = options.codeLength || type.minLength || 3;

        const container = document.createElement('div');
        container.className = 'rotary-lock';

        const instructions = document.createElement('p');
        const baseInstruction = 'Código de desbloqueo';
        instructions.className = 'rotary-heading';
        instructions.textContent = baseInstruction;
        container.appendChild(instructions);

        const dialValue = document.createElement('div');
        dialValue.className = 'rotary-value';
        dialValue.textContent = '0';
        container.appendChild(dialValue);

        const dialWrapper = document.createElement('div');
        dialWrapper.className = 'rotary-dial-wrapper';
        const dial = document.createElement('div');
        dial.className = 'rotary-dial';
        dial.tabIndex = 0;
        dial.setAttribute('role', 'slider');
        dial.setAttribute('aria-valuemin', '0');
        dial.setAttribute('aria-valuemax', String(maxNumber));
        dial.setAttribute('aria-valuenow', '0');
        dial.setAttribute('aria-label', 'Dial giratorio');

        const ticksContainer = document.createElement('div');
        ticksContainer.className = 'rotary-ticks';
        for (let i = 0; i <= maxNumber; i++) {
            const tick = document.createElement('span');
            tick.className = 'rotary-tick';
            const angle = (i / (maxNumber + 1)) * 360;
            tick.style.setProperty('--tick-rotation', `${angle}deg`);
            const label = document.createElement('span');
            label.textContent = i;
            tick.appendChild(label);
            ticksContainer.appendChild(tick);
        }

        const pointer = document.createElement('div');
        pointer.className = 'rotary-pointer';
        dial.appendChild(ticksContainer);
        dial.appendChild(pointer);
        dialWrapper.appendChild(dial);
        container.appendChild(dialWrapper);

        const dialSlider = document.createElement('input');
        dialSlider.type = 'range';
        dialSlider.min = 0;
        dialSlider.max = maxNumber;
        dialSlider.value = 0;
        dialSlider.className = 'rotary-slider';
        dialSlider.setAttribute('aria-hidden', 'true');
        dialSlider.setAttribute('aria-label', 'Dial numérico');
        container.appendChild(dialSlider);

        const updateDialValue = (value) => {
            const numericValue = Number(value);
            dialSlider.value = numericValue;
            dialValue.textContent = numericValue;
            dial.setAttribute('aria-valuenow', numericValue);
            dial.setAttribute('aria-valuetext', `${numericValue}`);
            pointer.style.setProperty('--pointer-rotation', `${(numericValue / (maxNumber + 1)) * 360}deg`);
        };

        dialSlider.addEventListener('input', () => {
            updateDialValue(dialSlider.value);
        });

        dial.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                const next = Math.min(maxNumber, Number(dialSlider.value) + 1);
                updateDialValue(next);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                const prev = Math.max(0, Number(dialSlider.value) - 1);
                updateDialValue(prev);
            }
        });

        dial.addEventListener('click', () => dial.focus());
        dial.addEventListener('wheel', (event) => {
            event.preventDefault();
            const delta = event.deltaY < 0 ? 1 : -1;
            const nextValue = Math.min(maxNumber, Math.max(0, Number(dialSlider.value) - delta));
            updateDialValue(nextValue);
        }, { passive: false });
        updateDialValue(0);

        const directionGroupName = `rotaryDirection-${Math.random().toString(36).slice(2)}`;
        const directionWrapper = document.createElement('div');
        directionWrapper.className = 'rotary-direction';
        directionWrapper.innerHTML = `
            <label><input type="radio" name="${directionGroupName}" value="R" checked> Derecha</label>
            <label><input type="radio" name="${directionGroupName}" value="L"> Izquierda</label>
        `;
        container.appendChild(directionWrapper);

        const sequenceLabel = document.createElement('p');
        sequenceLabel.className = 'rotary-sequence-heading';
        sequenceLabel.textContent = 'Secuencia';
        container.appendChild(sequenceLabel);

        const sequenceList = document.createElement('div');
        sequenceList.className = 'rotary-sequence';
        sequenceList.textContent = 'Secuencia vacía';
        container.appendChild(sequenceList);

        const steps = [];

        const actions = document.createElement('div');
        actions.className = 'rotary-actions';

        const addStep = document.createElement('button');
        addStep.className = 'btn btn-secondary';
        addStep.innerHTML = '<i class="fas fa-plus"></i> Añadir paso';
        addStep.addEventListener('click', () => {
            if (steps.length >= requiredSteps) {
                instructions.textContent = `Máximo ${requiredSteps} pasos.`;
                return;
            }
            const direction = container.querySelector(`input[name="${directionGroupName}"]:checked`)?.value || 'R';
            steps.push(`${direction}-${dialSlider.value}`);
            renderSequence();
        });

        const undo = document.createElement('button');
        undo.className = 'btn btn-secondary';
        undo.innerHTML = '<i class="fas fa-undo"></i> Deshacer';
        undo.addEventListener('click', () => {
            steps.pop();
            renderSequence();
        });

        const confirm = document.createElement('button');
        confirm.className = 'btn btn-primary';
        confirm.innerHTML = '<i class="fas fa-lock"></i> Confirmar';
        confirm.addEventListener('click', () => {
            if (steps.length !== requiredSteps) {
                instructions.textContent = `Necesitas ${requiredSteps} pasos para confirmar.`;
                return;
            }
            const event = new CustomEvent('codeEntered', { detail: steps.join('|') });
            container.dispatchEvent(event);
        });

        actions.appendChild(addStep);
        actions.appendChild(undo);
        actions.appendChild(confirm);
        container.appendChild(actions);

        function renderSequence() {
            instructions.textContent = baseInstruction;
            if (steps.length === 0) {
                sequenceList.textContent = 'Secuencia vacía';
                return;
            }
            sequenceList.textContent = steps.map((step, index) => `Paso ${index + 1}: ${step}`).join(' · ');
        }

        renderSequence();
        return container;
    }

    static validateCode(typeId, code, options = {}) {
        const type = this.resolveType(typeId);
        if (!type) return false;
        if (!code) return false;

        const normalizedType = typeId.toLowerCase();
        const minLength = options.codeLength || type.minLength || 1;
        const maxLength = options.codeLength || type.maxLength || Infinity;
        const requireExactLength = Boolean(options.codeLength);

        switch (normalizedType) {
            case 'numeric':
            case 'alphanumeric':
            case 'word-wheel':
            case 'cryptex':
                return typeof code === 'string' &&
                    (requireExactLength ? code.length === minLength : (code.length >= minLength && code.length <= maxLength));

            case 'musical':
            case 'emoji':
            case 'color':
                return typeof code === 'string' &&
                    (requireExactLength ? code.length === minLength : code.length >= minLength);

            case 'directional-4':
            case 'directional-8':
                if (code.includes('-')) {
                    const steps = code.split('-').filter(Boolean);
                    return requireExactLength ? steps.length === minLength : steps.length >= minLength;
                }
                return requireExactLength ? code.length === minLength : code.length >= minLength;
            
            case 'pattern-9':
            case 'pattern-16':
                const patternParts = code.split(',').filter(Boolean);
                return (requireExactLength ? patternParts.length === minLength : patternParts.length >= minLength) &&
                    patternParts.every(part => /^\d+$/.test(part));
            
            case 'computer-login':
                return code.includes(':');
            
            case 'switches':
                return typeof code === 'string' &&
                    /^[01]+$/.test(code) &&
                    code.length === (options.switches || options.codeLength || type.switches || code.length);
            
            case 'slider':
                const sliderParts = code.split('-').filter(Boolean);
                return sliderParts.length === (options.sliders || options.codeLength || type.sliders || sliderParts.length) &&
                    sliderParts.every(value => !isNaN(parseInt(value, 10)));

            case 'rotary':
                const rotaryParts = code.split('|').filter(Boolean);
                return rotaryParts.length === (options.codeLength || type.minLength || rotaryParts.length);

            case 'coordinates':
                return code.split(',').length === 2;
            
            default:
                return code.length >= requiredLength;
        }
    }
}

// Exportar la clase para su uso en otros archivos
export default LockTypes; 
