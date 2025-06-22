class LockSystem {
    static DIFFICULTY_LEVELS = {
        EASY: { points: 100, timeLimit: 300, hints: 3 },
        MEDIUM: { points: 200, timeLimit: 240, hints: 2 },
        HARD: { points: 300, timeLimit: 180, hints: 1 }
    };

    static THEMES = {
        HISTORY: {
            name: 'Historia',
            icon: 'fas fa-landmark',
            description: 'Candados basados en eventos históricos',
            categories: ['Antigüedad', 'Edad Media', 'Edad Moderna', 'Contemporánea']
        },
        SCIENCE: {
            name: 'Ciencia',
            icon: 'fas fa-flask',
            description: 'Candados sobre descubrimientos científicos',
            categories: ['Física', 'Química', 'Biología', 'Astronomía']
        },
        MATH: {
            name: 'Matemáticas',
            icon: 'fas fa-calculator',
            description: 'Candados con problemas matemáticos',
            categories: ['Aritmética', 'Álgebra', 'Geometría', 'Estadística']
        },
        LITERATURE: {
            name: 'Literatura',
            icon: 'fas fa-book',
            description: 'Candados sobre obras literarias',
            categories: ['Poesía', 'Novela', 'Teatro', 'Cuento']
        }
    };

    constructor() {
        this.currentLock = null;
        this.startTime = null;
        this.remainingHints = 0;
        this.usedHints = [];
        this.score = 0;
        this.missions = [];
        this.currentMission = null;
        this.loadProgress();
    }

    // Sistema de Pistas
    initializeHints(lockData) {
        this.currentLock = lockData;
        this.remainingHints = LockSystem.DIFFICULTY_LEVELS[lockData.difficulty].hints;
        this.usedHints = [];
        this.startTime = Date.now();
    }

    getNextHint() {
        if (this.remainingHints <= 0) {
            return null;
        }

        const hints = this.currentLock.hints || [];
        const availableHints = hints.filter(hint => !this.usedHints.includes(hint.id));
        
        if (availableHints.length === 0) {
            return null;
        }

        const hint = availableHints[0];
        this.usedHints.push(hint.id);
        this.remainingHints--;
        this.updateScore(-20); // Penalización por usar pista
        
        return hint;
    }

    // Sistema de Puntuación
    calculateScore() {
        if (!this.startTime) return 0;

        const timeSpent = (Date.now() - this.startTime) / 1000;
        const timeLimit = LockSystem.DIFFICULTY_LEVELS[this.currentLock.difficulty].timeLimit;
        const basePoints = LockSystem.DIFFICULTY_LEVELS[this.currentLock.difficulty].points;
        
        let score = basePoints;
        
        // Bonificación por tiempo
        if (timeSpent < timeLimit) {
            score += Math.floor((timeLimit - timeSpent) * 2);
        }
        
        // Penalización por pistas usadas
        score -= this.usedHints.length * 20;
        
        return Math.max(0, score);
    }

    updateScore(points) {
        this.score += points;
        this.saveProgress();
        this.updateScoreDisplay();
    }

    // Sistema de Misiones
    loadMissions() {
        const savedMissions = localStorage.getItem('lockMissions');
        if (savedMissions) {
            this.missions = JSON.parse(savedMissions);
        } else {
            this.initializeDefaultMissions();
        }
    }

    initializeDefaultMissions() {
        this.missions = [
            {
                id: 'first_lock',
                title: 'Primer Candado',
                description: 'Crea tu primer candado digital',
                reward: 50,
                completed: false,
                type: 'creation'
            },
            {
                id: 'theme_master',
                title: 'Maestro de Temas',
                description: 'Crea candados de 3 temas diferentes',
                reward: 100,
                completed: false,
                type: 'theme',
                progress: 0,
                target: 3
            },
            {
                id: 'speed_solver',
                title: 'Resolvedor Veloz',
                description: 'Resuelve un candado en menos de 60 segundos',
                reward: 150,
                completed: false,
                type: 'speed'
            }
        ];
        this.saveMissions();
    }

    updateMissionProgress(missionType, value = 1) {
        this.missions.forEach(mission => {
            if (!mission.completed && mission.type === missionType) {
                if (mission.type === 'theme') {
                    mission.progress = (mission.progress || 0) + value;
                    if (mission.progress >= mission.target) {
                        this.completeMission(mission);
                    }
                } else if (missionType === 'speed' && value <= 60) {
                    this.completeMission(mission);
                }
            }
        });
        this.saveMissions();
    }

    completeMission(mission) {
        mission.completed = true;
        this.updateScore(mission.reward);
        this.showMissionComplete(mission);
    }

    // Persistencia
    saveProgress() {
        const progress = {
            score: this.score,
            missions: this.missions,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('lockProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('lockProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.score = progress.score;
            this.missions = progress.missions;
        } else {
            this.score = 0;
            this.loadMissions();
        }
    }

    saveMissions() {
        localStorage.setItem('lockMissions', JSON.stringify(this.missions));
    }

    // UI Updates
    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('scoreDisplay');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Puntuación: ${this.score}`;
        }
    }

    showMissionComplete(mission) {
        const notification = document.createElement('div');
        notification.className = 'mission-notification success';
        notification.innerHTML = `
            <i class="fas fa-trophy"></i>
            <div class="mission-notification-content">
                <h4>¡Misión Completada!</h4>
                <p>${mission.title}</p>
                <span class="reward">+${mission.reward} puntos</span>
            </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

export default LockSystem; 