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
            difficulty: 'medium'
        },
        DIRECTIONAL_8: {
            id: 'directional-8',
            name: 'Direccional (8)',
            icon: 'fas fa-compass',
            description: 'Candado con 8 direcciones',
            directions: ['⬆️', '⬇️', '⬅️', '➡️', '↖️', '↗️', '↙️', '↘️'],
            template: 'directional-template',
            difficulty: 'hard'
        },
        COLOR: {
            id: 'color',
            name: 'Color',
            icon: 'fas fa-palette',
            description: 'Candado de colores',
            colors: ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
            template: 'color-template',
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
            difficulty: 'medium'
        },
        EMOJI: {
            id: 'emoji',
            name: 'Emoji',
            icon: 'fas fa-smile',
            description: 'Candado con emojis',
            emojis: ['😀', '😎', '🤖', '👻', '🎮', '🎲', '🎯', '🎨'],
            template: 'emoji-template',
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
        }
    };

    static getTemplate(typeId) {
        const type = this.TYPES[typeId.toUpperCase()];
        if (!type) return null;

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
            default:
                return null;
        }
    }

    static createNumericTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad numeric-keypad';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridTemplateRows = 'repeat(4, 1fr)';
        container.style.gap = '10px';
        
        // Comprobamos si hay opciones guardadas
        const digitOrderValue = document.querySelector('input[name="digitOrder"]:checked')?.value || '789456123';
        const isReversed = digitOrderValue === '123456789';
        
        // Orden de botones según la opción seleccionada
        let buttonOrder;
        if (isReversed) {
            // Orden 123, 456, 789
            buttonOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''];
        } else {
            // Orden 789, 456, 123 (predeterminado)
            buttonOrder = [7, 8, 9, 4, 5, 6, 1, 2, 3, '', 0, ''];
        }
        
        // Crear los botones en el orden configurado
        buttonOrder.forEach(num => {
            if (num === '') {
                const spacer = document.createElement('div');
                container.appendChild(spacer);
            } else {
                const button = document.createElement('button');
                button.className = 'keypad-button';
                button.textContent = num.toString();
                button.dataset.value = num.toString();
                if (num === 0) {
                    button.style.gridColumn = '2'; // Centrar el 0
                }
                container.appendChild(button);
            }
        });
        
        // Añadir botón de borrar si está habilitado
        const allowDelete = document.getElementById('allowDelete')?.checked;
        if (allowDelete) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'keypad-button delete-button';
            deleteButton.innerHTML = '<i class="fas fa-backspace"></i>';
            deleteButton.dataset.action = 'delete';
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
        const container = document.createElement('div');
        container.className = 'directional-keypad';
        container.style.backgroundColor = '#f5f5f5';
        container.style.padding = '20px';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        container.style.maxWidth = '400px';
        container.style.margin = '0 auto';
        
        // Crear el contenedor de memoria (secuencia seleccionada)
        const memoryContainer = document.createElement('div');
        memoryContainer.className = 'directional-memory';
        memoryContainer.style.display = 'flex';
        memoryContainer.style.justifyContent = 'center';
        memoryContainer.style.gap = '10px';
        memoryContainer.style.marginBottom = '20px';
        memoryContainer.style.padding = '15px';
        memoryContainer.style.backgroundColor = 'white';
        memoryContainer.style.borderRadius = '8px';
        memoryContainer.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
        memoryContainer.style.minHeight = '60px';
        memoryContainer.style.alignItems = 'center';
        container.appendChild(memoryContainer);
        
        // Crear el grid de direcciones
        const grid = document.createElement('div');
        grid.className = 'directional-grid';
        grid.style.display = 'grid';
        grid.style.gap = '10px';
        
        // Determinar el tamaño del grid basado en la cantidad de direcciones
        const gridSize = Math.ceil(Math.sqrt(type.directions.length));
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Añadir los botones de dirección
        type.directions.forEach((direction, index) => {
            const button = document.createElement('button');
            button.className = 'directional-button';
            button.dataset.value = direction;
            button.dataset.index = index;
            
            // Configurar el contenido del botón con el emoji
            button.textContent = direction;
            
            // Estilos para el botón
            button.style.fontSize = '24px'; // Tamaño grande para el emoji
            button.style.padding = '20px';
            button.style.border = 'none';
            button.style.borderRadius = '10px';
            button.style.backgroundColor = '#0066cc';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 4px 0 #004c99, 0 6px 10px rgba(0, 0, 0, 0.2)';
            button.style.transition = 'all 0.2s ease';
            button.style.aspectRatio = '1 / 1'; // Asegurar que sea cuadrado
            
            // Efectos de hover y active
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#0077ee';
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#0066cc';
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(4px)';
                button.style.boxShadow = '0 0 0 #004c99, 0 2px 4px rgba(0, 0, 0, 0.2)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 0 #004c99, 0 6px 10px rgba(0, 0, 0, 0.2)';
            });
            
            grid.appendChild(button);
        });
        
        container.appendChild(grid);

        // Añadir eventos a los botones
        let currentSequence = [];
        grid.querySelectorAll('.directional-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 200);
                
                currentSequence.push(index);
                updateMemory(currentSequence);
                
                // Verificar si la secuencia es correcta
                if (currentSequence.length === type.directions.length) {
                    const code = currentSequence.map(i => type.directions[i]).join('');
                    const event = new CustomEvent('codeEntered', { detail: code });
                    container.dispatchEvent(event);
                }
            });
        });

        // Función para actualizar la memoria
        function updateMemory(sequence) {
            memoryContainer.innerHTML = '';
            sequence.forEach(index => {
                const memoryItem = document.createElement('div');
                memoryItem.style.fontSize = '24px';
                memoryItem.style.padding = '5px 10px';
                memoryItem.style.backgroundColor = '#e9ecef';
                memoryItem.style.borderRadius = '6px';
                memoryItem.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                memoryItem.style.animation = 'fadeIn 0.3s ease';
                memoryItem.textContent = type.directions[index];
                memoryContainer.appendChild(memoryItem);
            });
        }

        // Añadir un botón para reiniciar la secuencia
        const resetButton = document.createElement('button');
        resetButton.textContent = '🔄 Reiniciar secuencia';
        resetButton.style.marginTop = '20px';
        resetButton.style.width = '100%';
        resetButton.style.padding = '10px';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '6px';
        resetButton.style.backgroundColor = '#6c757d';
        resetButton.style.color = 'white';
        resetButton.style.cursor = 'pointer';
        resetButton.style.fontSize = '16px';
        resetButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        resetButton.addEventListener('click', () => {
            currentSequence = [];
            updateMemory(currentSequence);
        });
        container.appendChild(resetButton);

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

    static validateCode(typeId, code) {
        const type = this.TYPES[typeId.toUpperCase()];
        if (!type) return false;

        // Validaciones específicas por tipo
        switch (typeId) {
            case 'numeric':
            case 'alphanumeric':
                return code.length >= type.minLength && code.length <= type.maxLength;
            
            case 'directional-4':
            case 'directional-8':
                // Si el código contiene 'dir-', es de nuestro nuevo formato
                if (code.includes('dir-')) {
                    const parts = code.split(',');
                    return parts.length === type.directions.length;
                } else {
                    // Mantener compatibilidad con códigos antiguos
                    return code.length === type.directions.length;
                }
            
            case 'pattern-9':
            case 'pattern-16':
                const parts = code.split(',');
                return parts.length > 0 && parts.every(part => /^\d+$/.test(part));
            
            case 'computer-login':
                return code.includes(':');
            
            default:
                return code.length > 0;
        }
    }
}

// Exportar la clase para su uso en otros archivos
export default LockTypes; 