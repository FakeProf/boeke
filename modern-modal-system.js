// Modern Modal System - No Scroll, Maximum Appeal
// Ersetzt alle bestehenden Modal-Implementierungen

class ModernModalSystem {
    constructor() {
        this.activeModal = null;
        this.modalHistory = [];
    }

    // ==================== MODERN QUIZ MODAL ====================
    
    showModernQuiz(quizData) {
        this.closeActiveModal();
        
        const modal = document.createElement('div');
        modal.className = 'modern-modal';
        modal.innerHTML = this.createQuizHTML(quizData);
        
        document.body.appendChild(modal);
        this.activeModal = modal;
        
        this.setupQuizEventListeners(modal, quizData);
        this.startQuizTimer(modal, quizData);
    }

    createQuizHTML(quizData) {
        const question = quizData.questions[quizData.currentQuestion];
        const progress = ((quizData.currentQuestion + 1) / quizData.questions.length) * 100;
        
        return `
            <div class="modern-modal-content quiz-modal">
                <div class="quiz-header">
                    <h2 class="quiz-title">
                        <i class="fas fa-brain"></i>
                        ${quizData.title || 'Intelligentes Quiz'}
                    </h2>
                    <button class="quiz-close" onclick="modernModalSystem.closeActiveModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="quiz-body">
                    <div class="quiz-progress-section">
                        <div class="progress-info">
                            <span class="progress-text">Frage ${quizData.currentQuestion + 1} von ${quizData.questions.length}</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <div class="progress-stats">
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <span id="timeDisplay">${this.formatTime(quizData.timeRemaining)}</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-star"></i>
                                <span>${quizData.score || 0} XP</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-fire"></i>
                                <span>Streak: ${quizData.streak || 0}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="question-container">
                        <div class="question-header">
                            <h3 class="question-title">${question.question || question.scenario}</h3>
                            <div class="question-meta">
                                <span class="difficulty-badge ${question.difficulty}">${this.getDifficultyLabel(question.difficulty)}</span>
                                <span class="points-badge">${question.points || 10} XP</span>
                            </div>
                        </div>
                        
                        <div class="scenario-content">
                            ${this.createScenarioContent(question)}
                            
                            <div class="answer-section">
                                <h4 class="answer-prompt">
                                    <i class="fas fa-mouse-pointer"></i>
                                    Wählen Sie Ihre Antwort:
                                </h4>
                                <div class="answer-options">
                                    ${this.createAnswerOptions(question)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-footer">
                    <div class="quiz-stats">
                        <div class="streak-display">
                            <i class="fas fa-fire"></i>
                            <span>Streak: ${quizData.streak || 0}</span>
                        </div>
                        <div class="perfect-display">
                            <i class="fas fa-trophy"></i>
                            <span>Perfect: ${quizData.perfectStreak || 0}</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button class="btn-modern btn-secondary-modern" onclick="modernModalSystem.skipQuestion()">
                            <i class="fas fa-forward"></i>
                            Überspringen
                        </button>
                        <button class="btn-modern btn-primary-modern" id="submitBtn" disabled onclick="modernModalSystem.submitAnswer()">
                            <i class="fas fa-check"></i>
                            Antworten
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createScenarioContent(question) {
        if (question.type === 'scenario_based' && question.scenario) {
            return `
                <div class="scenario-story">
                    <h4><i class="fas fa-book-open"></i> Situation:</h4>
                    <p>${question.scenario}</p>
                </div>
                <div class="scenario-challenge">
                    <h4><i class="fas fa-target"></i> Herausforderung:</h4>
                    <p>${question.challenge || question.question}</p>
                </div>
            `;
        } else if (question.type === 'roleplay') {
            return `
                <div class="roleplay-content">
                    <div class="roleplay-scenario">
                        <h4><i class="fas fa-theater-masks"></i> Rollenspiel:</h4>
                        <p>${question.scenario}</p>
                    </div>
                    <div class="roleplay-character">
                        <div class="character-info">
                            <img src="${question.character?.avatar || '/default-avatar.png'}" alt="${question.character?.name}" class="character-avatar">
                            <div class="character-details">
                                <h5>${question.character?.name || 'Kunde'}</h5>
                                <p>${question.character?.role || 'Entscheidungsträger'}</p>
                                <p class="character-personality">${question.character?.personality || 'Professionell'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="roleplay-response">
                        <h4><i class="fas fa-comment-dots"></i> Ihre Antwort:</h4>
                        <textarea class="response-textarea" placeholder="Wie reagieren Sie? Schreiben Sie Ihre Antwort..." rows="4"></textarea>
                    </div>
                </div>
            `;
        }
        return '';
    }

    createAnswerOptions(question) {
        if (question.type === 'roleplay') {
            return ''; // Roleplay hat keine Optionen
        }
        
        return question.options.map((option, index) => `
            <label class="option-card" onclick="modernModalSystem.selectOption(${index})">
                <input type="radio" name="answer" value="${index}" class="option-radio" onchange="modernModalSystem.enableSubmit()">
                <span class="option-text">${option}</span>
            </label>
        `).join('');
    }

    // ==================== MODERN ROLEPLAY MODAL ====================
    
    showModernRoleplay(roleplayData) {
        this.closeActiveModal();
        
        const modal = document.createElement('div');
        modal.className = 'modern-modal';
        modal.innerHTML = this.createRoleplayHTML(roleplayData);
        
        document.body.appendChild(modal);
        this.activeModal = modal;
        
        this.setupRoleplayEventListeners(modal, roleplayData);
    }

    createRoleplayHTML(roleplayData) {
        const scenario = roleplayData.scenarios[roleplayData.currentScenario];
        const progress = ((roleplayData.currentScenario + 1) / roleplayData.scenarios.length) * 100;
        
        return `
            <div class="modern-modal-content roleplay-modal">
                <div class="quiz-header">
                    <h2 class="quiz-title">
                        <i class="fas fa-theater-masks"></i>
                        ${roleplayData.title || 'Rollenspiel'}
                    </h2>
                    <button class="quiz-close" onclick="modernModalSystem.closeActiveModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="quiz-body">
                    <div class="quiz-progress-section">
                        <div class="progress-info">
                            <span class="progress-text">Szenario ${roleplayData.currentScenario + 1} von ${roleplayData.scenarios.length}</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <div class="progress-stats">
                            <div class="stat-item">
                                <i class="fas fa-star"></i>
                                <span>${roleplayData.score || 0} XP</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-fire"></i>
                                <span>Streak: ${roleplayData.streak || 0}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="question-container">
                        <div class="question-header">
                            <h3 class="question-title">${scenario.title}</h3>
                            <div class="question-meta">
                                <span class="difficulty-badge ${scenario.difficulty || 'intermediate'}">${this.getDifficultyLabel(scenario.difficulty || 'intermediate')}</span>
                                <span class="points-badge">${scenario.points || 15} XP</span>
                            </div>
                        </div>
                        
                        <div class="roleplay-content">
                            <div class="roleplay-scenario">
                                <h4><i class="fas fa-book-open"></i> Situation:</h4>
                                <p>${scenario.situation}</p>
                            </div>
                            
                            <div class="roleplay-character">
                                <div class="character-info">
                                    <img src="${scenario.character?.avatar || '/default-avatar.png'}" alt="${scenario.character?.name}" class="character-avatar">
                                    <div class="character-details">
                                        <h5>${scenario.character?.name || 'Kunde'}</h5>
                                        <p>${scenario.character?.role || 'Entscheidungsträger'}</p>
                                        <p class="character-personality">${scenario.character?.personality || 'Professionell'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="roleplay-response">
                                <h4><i class="fas fa-comment-dots"></i> Ihre Antwort:</h4>
                                <textarea class="response-textarea" placeholder="Wie reagieren Sie? Schreiben Sie Ihre Antwort..." rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-footer">
                    <div class="quiz-stats">
                        <div class="streak-display">
                            <i class="fas fa-fire"></i>
                            <span>Streak: ${roleplayData.streak || 0}</span>
                        </div>
                        <div class="perfect-display">
                            <i class="fas fa-trophy"></i>
                            <span>Perfect: ${roleplayData.perfectStreak || 0}</span>
                        </div>
                    </div>
                    <div class="quiz-actions">
                        <button class="btn-modern btn-secondary-modern" onclick="modernModalSystem.skipScenario()">
                            <i class="fas fa-forward"></i>
                            Überspringen
                        </button>
                        <button class="btn-modern btn-primary-modern" onclick="modernModalSystem.submitRoleplayAnswer()">
                            <i class="fas fa-check"></i>
                            Antworten
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== EVENT HANDLERS ====================
    
    setupQuizEventListeners(modal, quizData) {
        // Option selection
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-card')) {
                this.selectOption(e.target);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeActiveModal();
            } else if (e.key >= '1' && e.key <= '9') {
                const optionIndex = parseInt(e.key) - 1;
                const options = modal.querySelectorAll('.option-card');
                if (options[optionIndex]) {
                    this.selectOption(options[optionIndex]);
                }
            }
        });
    }

    setupRoleplayEventListeners(modal, roleplayData) {
        // Auto-resize textarea
        const textarea = modal.querySelector('.response-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        }
    }

    selectOption(optionElement) {
        // Remove previous selection
        const allOptions = document.querySelectorAll('.option-card');
        allOptions.forEach(option => {
            option.classList.remove('selected');
            option.querySelector('input[type="radio"]').checked = false;
        });
        
        // Select current option
        optionElement.classList.add('selected');
        optionElement.querySelector('input[type="radio"]').checked = true;
        
        // Enable submit button
        this.enableSubmit();
    }

    enableSubmit() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    submitAnswer() {
        const selectedOption = document.querySelector('.option-card.selected');
        if (!selectedOption) return;
        
        const optionIndex = Array.from(document.querySelectorAll('.option-card')).indexOf(selectedOption);
        const question = this.getCurrentQuestion();
        
        // Process answer
        this.processAnswer(optionIndex, question);
    }

    submitRoleplayAnswer() {
        const textarea = document.querySelector('.response-textarea');
        const response = textarea ? textarea.value.trim() : '';
        
        if (!response) {
            alert('Bitte geben Sie eine Antwort ein.');
            return;
        }
        
        // Process roleplay answer
        this.processRoleplayAnswer(response);
    }

    skipQuestion() {
        // Handle skip logic
        this.nextQuestion();
    }

    skipScenario() {
        // Handle scenario skip logic
        this.nextScenario();
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    closeActiveModal() {
        if (this.activeModal) {
            this.activeModal.remove();
            this.activeModal = null;
        }
        
        // Remove any remaining modals
        const existingModals = document.querySelectorAll('.modern-modal');
        existingModals.forEach(modal => modal.remove());
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            'beginner': 'Anfänger',
            'intermediate': 'Fortgeschritten',
            'advanced': 'Experte',
            'expert': 'Meister'
        };
        return labels[difficulty] || 'Unbekannt';
    }

    startQuizTimer(modal, quizData) {
        if (!quizData.timeLimit) return;
        
        const timeDisplay = modal.querySelector('#timeDisplay');
        let timeLeft = quizData.timeRemaining || quizData.timeLimit;
        
        const timer = setInterval(() => {
            timeLeft--;
            if (timeDisplay) {
                timeDisplay.textContent = this.formatTime(timeLeft);
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.timeUp();
            }
        }, 1000);
        
        // Store timer reference
        modal.timer = timer;
    }

    timeUp() {
        alert('Zeit abgelaufen!');
        this.nextQuestion();
    }

    // ==================== PLACEHOLDER METHODS ====================
    
    processAnswer(optionIndex, question) {
        // Implement answer processing logic
        console.log('Answer processed:', optionIndex, question);
        this.nextQuestion();
    }

    processRoleplayAnswer(response) {
        // Implement roleplay answer processing
        console.log('Roleplay answer processed:', response);
        this.nextScenario();
    }

    nextQuestion() {
        // Implement next question logic
        console.log('Next question');
    }

    nextScenario() {
        // Implement next scenario logic
        console.log('Next scenario');
    }

    getCurrentQuestion() {
        // Return current question data
        return {};
    }
}

// ==================== GLOBAL INSTANCE ====================
const modernModalSystem = new ModernModalSystem();

// ==================== ENHANCED QUIZ FUNCTIONS ====================

function startModernQuiz(topic, difficulty = 'intermediate') {
    const quizData = {
        title: `Intelligentes ${topic} Quiz`,
        currentQuestion: 0,
        questions: generateQuizQuestions(topic, difficulty),
        timeLimit: 30,
        timeRemaining: 30,
        score: 0,
        streak: 0,
        perfectStreak: 0
    };
    
    modernModalSystem.showModernQuiz(quizData);
}

function startModernRoleplay(topic) {
    const roleplayData = {
        title: `${topic} Rollenspiel`,
        currentScenario: 0,
        scenarios: generateRoleplayScenarios(topic),
        score: 0,
        streak: 0,
        perfectStreak: 0
    };
    
    modernModalSystem.showModernRoleplay(roleplayData);
}

function generateQuizQuestions(topic, difficulty) {
    // Generate questions based on topic and difficulty
    const questionBank = {
        'objection_handling': [
            {
                type: 'scenario_based',
                scenario: 'Sie verkaufen ein CRM-System für 15.000€/Jahr. Der Kunde sagt: "Das ist mir zu teuer."',
                challenge: 'Wie reagieren Sie professionell?',
                question: 'Wie reagieren Sie auf den Preis-Einwand?',
                options: [
                    'Wert-Kommunikation: "Lassen Sie uns über den ROI sprechen..."',
                    'Kosten des Nicht-Handelns: "Was kostet Sie das aktuelle System?"',
                    'Zahlungspläne: "Wir können das in Raten anbieten"',
                    'ROI-Berechnung: "Die Amortisation erfolgt in 6 Monaten"'
                ],
                correct: 1,
                difficulty: difficulty,
                points: 15
            },
            {
                type: 'scenario_based',
                scenario: 'Kunde: "Ich habe keine Zeit für ein Gespräch. Rufen Sie nächste Woche an."',
                challenge: 'Wie schaffen Sie Zeit für das Gespräch?',
                question: 'Wie überwinden Sie den Zeit-Einwand?',
                options: [
                    'Zeit-Umleitung: "Genau deshalb ist es wichtig, jetzt zu handeln"',
                    'Zeitersparnis: "Das spart Ihnen 2 Stunden pro Woche"',
                    'Dringlichkeit: "Was passiert, wenn Sie warten?"',
                    'Terminvereinbarung: "Wann haben Sie 15 Minuten?"'
                ],
                correct: 2,
                difficulty: difficulty,
                points: 15
            }
        ],
        'question_techniques': [
            {
                type: 'scenario_based',
                scenario: 'Sie führen ein Erstgespräch mit einem potenziellen Kunden. Sie wissen wenig über seine Situation.',
                challenge: 'Welche Frage stellen Sie zuerst?',
                question: 'Welche SPIN-Frage ist am wichtigsten?',
                options: [
                    'Situation: "Wie läuft die Kundengewinnung aktuell?"',
                    'Problem: "Was bereitet Ihnen die größten Schwierigkeiten?"',
                    'Implication: "Was passiert, wenn Sie nichts ändern?"',
                    'Need-payoff: "Wie würde sich das für Sie auszahlen?"'
                ],
                correct: 0,
                difficulty: difficulty,
                points: 15
            },
            {
                type: 'scenario_based',
                scenario: 'Sie qualifizieren einen Lead. Sie müssen herausfinden, ob er budgetiert und entscheidungsbefugt ist.',
                challenge: 'Welche BANT-Frage stellen Sie?',
                question: 'Wie qualifizieren Sie Budget und Autorität?',
                options: [
                    'Budget: "Welches Budget haben Sie dafür?"',
                    'Authority: "Wer trifft die finale Entscheidung?"',
                    'Need: "Welche Herausforderungen haben Sie?"',
                    'Timeline: "Wann brauchen Sie eine Lösung?"'
                ],
                correct: 1,
                difficulty: difficulty,
                points: 15
            }
        ],
        'psychology': [
            {
                type: 'scenario_based',
                scenario: 'Sie haben einen dominanten Kundentyp vor sich. Er ist direkt, ergebnisorientiert und hat wenig Zeit.',
                challenge: 'Wie passen Sie Ihren Verkaufsansatz an?',
                question: 'Wie verkaufen Sie an einen dominanten Typ?',
                options: [
                    'Fokus auf Ergebnisse: "Das bringt Ihnen 30% mehr Effizienz"',
                    'Zeit sparen: "Das spart Ihnen 2 Stunden pro Tag"',
                    'Kontrolle betonen: "Sie behalten die volle Kontrolle"',
                    'Direkte Kommunikation: "Lassen Sie mich Ihnen die Fakten zeigen"'
                ],
                correct: 0,
                difficulty: difficulty,
                points: 15
            },
            {
                type: 'scenario_based',
                scenario: 'Ein Kunde zögert bei der Entscheidung. Sie wollen das Prinzip der Knappheit nutzen.',
                challenge: 'Wie schaffen Sie Dringlichkeit?',
                question: 'Wie nutzen Sie Knappheit im Verkauf?',
                options: [
                    'Limitierte Zeit: "Das Angebot gilt nur bis Freitag"',
                    'Limitierte Menge: "Nur noch 3 Plätze verfügbar"',
                    'Exklusivität: "Nur für ausgewählte Kunden"',
                    'Konsequenzen: "Was passiert, wenn Sie warten?"'
                ],
                correct: 0,
                difficulty: difficulty,
                points: 15
            }
        ],
        'language': [
            {
                type: 'scenario_based',
                scenario: 'Sie präsentieren Ihr Produkt. Welche Formulierung ist am überzeugendsten?',
                challenge: 'Wählen Sie die beste Verkaufssprache',
                question: 'Welche Formulierung ist am wirkungsvollsten?',
                options: [
                    '"Das ist ein gutes Produkt"',
                    '"Das bringt Ihnen echten Mehrwert"',
                    '"Das ist preiswert"',
                    '"Das ist billig"'
                ],
                correct: 1,
                difficulty: difficulty,
                points: 15
            }
        ]
    };
    
    return questionBank[topic] || [];
}

function generateRoleplayScenarios(topic) {
    const scenarioBank = {
        'objection_handling': [
            {
                title: 'Kaltakquise - Gatekeeper',
                situation: 'Sie rufen ein Unternehmen an und werden von der Sekretärin abgefangen. Sie müssen zum Entscheider durchkommen.',
                character: {
                    name: 'Frau Müller',
                    role: 'Sekretärin',
                    personality: 'Vorsichtig und beschützend',
                    avatar: '/secretary-avatar.png'
                },
                difficulty: 'intermediate',
                points: 20
            }
        ]
    };
    
    return scenarioBank[topic] || [];
}

// ==================== EXPORT FOR USE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernModalSystem;
} else {
    window.ModernModalSystem = ModernModalSystem;
    window.startModernQuiz = startModernQuiz;
    window.startModernRoleplay = startModernRoleplay;
}
