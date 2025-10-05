// SalesMaster - Vertriebslernplattform JavaScript

class SalesMaster {
    constructor() {
        this.currentTab = 'dashboard';
        this.timer = {
            isRunning: false,
            startTime: null,
            elapsed: 0
        };
        this.progress = this.loadProgress();
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        console.log('SalesMaster initializing...');
        this.setupEventListeners();
        this.updateDashboard();
        this.loadAchievements();
        this.startProgressTracking();
        console.log('SalesMaster initialized successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Tab Navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        console.log('Found', navTabs.length, 'nav tabs');
        
        navTabs.forEach((tab, index) => {
            console.log('Adding listener to tab', index, tab.dataset.tab);
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Tab clicked:', e.currentTarget.dataset.tab);
                this.switchTab(e.currentTarget.dataset.tab);
            });
        });

        // Objection Categories
        document.querySelectorAll('.objection-categories .category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Objection category clicked:', e.currentTarget.dataset.category);
                this.switchObjectionCategory(e.currentTarget.dataset.category);
            });
        });

        // Question Categories
        document.querySelectorAll('.question-categories .category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Question category clicked:', e.currentTarget.dataset.category);
                this.switchQuestionCategory(e.currentTarget.dataset.category);
            });
        });

        // Quiz Options
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                e.preventDefault();
                this.selectQuizAnswer(e.target);
            }
        });

        // Roleplay Scenarios
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Scenario clicked:', e.currentTarget.dataset.scenario);
                this.startRoleplayScenario(e.currentTarget.dataset.scenario);
            });
        });

        // Flashcard
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => {
                this.flipFlashcard();
            });
        }

        // Chat Input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Timer Button
        const timerBtn = document.querySelector('.timer-btn');
        if (timerBtn) {
            timerBtn.addEventListener('click', () => {
                this.toggleTimer();
            });
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Remove active class from nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        const targetNavTab = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab content activated');
        } else {
            console.error('Tab content not found:', tabName);
        }
        
        if (targetNavTab) {
            targetNavTab.classList.add('active');
            console.log('Nav tab activated');
        } else {
            console.error('Nav tab not found:', tabName);
        }

        this.currentTab = tabName;
    }

    // Dashboard Functions
    updateDashboard() {
        document.getElementById('todayProgress').textContent = this.progress.todayMinutes;
        document.getElementById('streak').textContent = this.progress.streak;
        document.getElementById('level').textContent = this.progress.level;
        document.getElementById('points').textContent = this.progress.points;
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressPercent = Math.min((this.progress.todayMinutes / 30) * 100, 100);
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
    }

    startProgressTracking() {
        setInterval(() => {
            if (this.timer.isRunning) {
                this.timer.elapsed = Date.now() - this.timer.startTime;
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.elapsed / 60000);
        const seconds = Math.floor((this.timer.elapsed % 60000) / 1000);
        document.getElementById('timerText').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    toggleTimer() {
        if (this.timer.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.timer.isRunning = true;
        this.timer.startTime = Date.now() - this.timer.elapsed;
        document.getElementById('timerIcon').className = 'fas fa-pause';
    }

    stopTimer() {
        this.timer.isRunning = false;
        this.progress.todayMinutes += Math.floor(this.timer.elapsed / 60000);
        this.timer.elapsed = 0;
        document.getElementById('timerIcon').className = 'fas fa-play';
        document.getElementById('timerText').textContent = '00:00';
        this.updateDashboard();
        this.saveProgress();
    }

    // Objection Handling
    switchObjectionCategory(category) {
        console.log('Switching objection category to:', category);
        
        // Remove active class from all category buttons
        document.querySelectorAll('.objection-categories .category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected category
        const selectedBtn = document.querySelector(`[data-category="${category}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        const objections = this.getObjectionsByCategory(category);
        if (objections.length > 0) {
            this.displayObjection(objections[0]);
        }
    }

    getObjectionsByCategory(category) {
        const objectionData = {
            price: [
                {
                    objection: "Das ist mir zu teuer.",
                    response: "Ich verstehe Ihre Bedenken zum Preis. Lassen Sie mich Ihnen zeigen, wie sich diese Investition für Sie auszahlt. Was würde es Sie kosten, wenn Sie nichts unternehmen?"
                },
                {
                    objection: "Wir haben kein Budget dafür.",
                    response: "Das verstehe ich. Lassen Sie uns überlegen, wie wir das Budget freimachen können. Welche Kosten könnten wir reduzieren oder welche Einsparungen könnten wir erzielen?"
                }
            ],
            time: [
                {
                    objection: "Ich habe keine Zeit dafür.",
                    response: "Zeit ist wertvoll, das verstehe ich. Aber wie viel Zeit kostet Sie das aktuelle Problem? Lassen Sie uns schauen, wie wir Ihnen Zeit sparen können."
                },
                {
                    objection: "Rufen Sie in 6 Monaten nochmal an.",
                    response: "Ich verstehe, dass Sie jetzt beschäftigt sind. Aber was passiert, wenn wir in 6 Monaten anrufen und das Problem noch größer geworden ist?"
                }
            ],
            authority: [
                {
                    objection: "Ich bin nicht der Entscheider.",
                    response: "Das ist in Ordnung. Wer trifft normalerweise solche Entscheidungen? Können Sie mir helfen, die richtige Person zu erreichen?"
                },
                {
                    objection: "Ich muss das mit meinem Chef besprechen.",
                    response: "Das ist verständlich. Welche Informationen braucht Ihr Chef, um eine fundierte Entscheidung zu treffen?"
                }
            ],
            need: [
                {
                    objection: "Wir brauchen das nicht.",
                    response: "Das kann ich verstehen. Lassen Sie mich fragen: Was sind Ihre größten Herausforderungen im Moment? Vielleicht können wir Ihnen dabei helfen."
                },
                {
                    objection: "Wir sind zufrieden mit unserem aktuellen Anbieter.",
                    response: "Das ist schön zu hören. Was gefällt Ihnen besonders gut an Ihrem aktuellen Anbieter? Gibt es etwas, was Sie sich anders wünschen würden?"
                }
            ]
        };
        return objectionData[category] || [];
    }

    displayObjection(objection) {
        document.getElementById('objectionText').textContent = objection.objection;
        document.getElementById('objectionResponse').textContent = objection.response;
        document.getElementById('objectionResponse').style.display = 'none';
    }

    showResponse() {
        document.getElementById('objectionResponse').style.display = 'block';
        this.addPoints(5);
    }

    nextObjection() {
        const category = document.querySelector('.objection-categories .category-btn.active').dataset.category;
        const objections = this.getObjectionsByCategory(category);
        const currentIndex = Math.floor(Math.random() * objections.length);
        this.displayObjection(objections[currentIndex]);
        this.addPoints(2);
    }

    // Question Handling
    switchQuestionCategory(category) {
        console.log('Switching question category to:', category);
        
        // Remove active class from all category buttons
        document.querySelectorAll('.question-categories .category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected category
        const selectedBtn = document.querySelector(`[data-category="${category}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        const questions = this.getQuestionsByCategory(category);
        if (questions.length > 0) {
            this.displayQuestion(questions[0]);
        }
    }

    getQuestionsByCategory(category) {
        const questionData = {
            discovery: [
                {
                    question: "Was sind Ihre größten Herausforderungen bei...?",
                    tips: [
                        "Öffnet das Gespräch",
                        "Zeigt Interesse am Kunden",
                        "Identifiziert Bedürfnisse",
                        "Schafft Vertrauen"
                    ]
                },
                {
                    question: "Wie läuft das aktuell bei Ihnen?",
                    tips: [
                        "Erkundet den Status Quo",
                        "Identifiziert Schmerzpunkte",
                        "Zeigt Interesse am Prozess"
                    ]
                }
            ],
            pain: [
                {
                    question: "Was passiert, wenn Sie nichts unternehmen?",
                    tips: [
                        "Schafft Dringlichkeit",
                        "Zeigt Konsequenzen auf",
                        "Macht den Schmerz sichtbar"
                    ]
                },
                {
                    question: "Wie viel kostet Sie das Problem?",
                    tips: [
                        "Quantifiziert den Schmerz",
                        "Schafft Budget",
                        "Zeigt ROI auf"
                    ]
                }
            ],
            budget: [
                {
                    question: "Welches Budget haben Sie für solche Projekte?",
                    tips: [
                        "Direkte Budgetfrage",
                        "Zeigt Ernsthaftigkeit",
                        "Ermöglicht Anpassung"
                    ]
                },
                {
                    question: "Was würde es Sie kosten, wenn Sie nichts tun?",
                    tips: [
                        "Relativiert den Preis",
                        "Zeigt Wert auf",
                        "Schafft Vergleich"
                    ]
                }
            ],
            decision: [
                {
                    question: "Wer ist noch an der Entscheidung beteiligt?",
                    tips: [
                        "Identifiziert Stakeholder",
                        "Erkundet Prozess",
                        "Zeigt Komplexität"
                    ]
                },
                {
                    question: "Was brauchen Sie, um eine Entscheidung zu treffen?",
                    tips: [
                        "Klärt nächste Schritte",
                        "Identifiziert Hindernisse",
                        "Schafft Klarheit"
                    ]
                }
            ]
        };
        return questionData[category] || [];
    }

    displayQuestion(question) {
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('questionTips').innerHTML = `
            <h4>Warum diese Frage?</h4>
            <ul>
                ${question.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
        document.getElementById('questionTips').style.display = 'none';
    }

    showTips() {
        document.getElementById('questionTips').style.display = 'block';
        this.addPoints(3);
    }

    nextQuestion() {
        const category = document.querySelector('.question-categories .category-btn.active').dataset.category;
        const questions = this.getQuestionsByCategory(category);
        const currentIndex = Math.floor(Math.random() * questions.length);
        this.displayQuestion(questions[currentIndex]);
        this.addPoints(2);
    }

    // Quiz Functions
    selectQuizAnswer(selectedBtn) {
        const isCorrect = selectedBtn.dataset.answer === 'B'; // Correct answer
        const allOptions = document.querySelectorAll('.option-btn');
        
        allOptions.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === 'B') {
                btn.classList.add('correct');
            } else if (btn === selectedBtn && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            this.addPoints(10);
        }

        setTimeout(() => {
            this.nextQuizQuestion();
        }, 2000);
    }

    nextQuizQuestion() {
        const currentQuestion = parseInt(document.querySelector('.quiz-question h3').textContent.split(' ')[1]);
        const totalQuestions = 5;

        if (currentQuestion < totalQuestions) {
            this.loadQuizQuestion(currentQuestion + 1);
        } else {
            this.showQuizResult();
        }
    }

    loadQuizQuestion(questionNumber) {
        const questions = this.getQuizQuestions();
        const question = questions[questionNumber - 1];
        
        document.querySelector('.quiz-question h3').textContent = `Frage ${questionNumber} von 5`;
        document.getElementById('question').textContent = question.question;
        
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.answer = String.fromCharCode(65 + index);
            btn.textContent = option;
            optionsContainer.appendChild(btn);
        });
    }

    getQuizQuestions() {
        return [
            {
                question: "Was ist der wichtigste Schritt beim Erstgespräch?",
                options: [
                    "Sofort das Produkt präsentieren",
                    "Bedürfnisse des Kunden erkunden",
                    "Preis nennen",
                    "Termin für nächste Woche vereinbaren"
                ]
            },
            {
                question: "Wie reagieren Sie am besten auf 'Das ist zu teuer'?",
                options: [
                    "Sofort den Preis senken",
                    "Den Wert und ROI erklären",
                    "Konkurrenz schlecht machen",
                    "Aufgeben und gehen"
                ]
            },
            {
                question: "Was ist das Ziel von offenen Fragen?",
                options: [
                    "Den Kunden zum Schweigen bringen",
                    "Mehr über Bedürfnisse erfahren",
                    "Zeit schinden",
                    "Impressen"
                ]
            },
            {
                question: "Wann ist der beste Zeitpunkt für den Abschluss?",
                options: [
                    "Nach 2 Minuten",
                    "Wenn der Kunde bereit ist",
                    "Nie",
                    "Am Ende des Gesprächs"
                ]
            },
            {
                question: "Was ist der wichtigste Faktor für Vertriebserfolg?",
                options: [
                    "Gutes Aussehen",
                    "Vertrauen aufbauen",
                    "Laut sprechen",
                    "Viele Termine"
                ]
            }
        ];
    }

    showQuizResult() {
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('quizResult').style.display = 'block';
        
        const score = this.progress.quizScore || 0;
        document.getElementById('quizScore').textContent = `${score}/5`;
    }

    restartQuiz() {
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('quizResult').style.display = 'none';
        this.loadQuizQuestion(1);
    }

    // Roleplay Functions
    startRoleplayScenario(scenario) {
        const scenarios = {
            'cold-call': {
                title: 'Kaltakquise',
                description: 'Du rufst einen neuen Kunden an. Wie beginnst du das Gespräch?',
                messages: [
                    { type: 'customer', text: 'Hallo, hier ist Müller.' },
                    { type: 'salesperson', text: 'Guten Tag Herr Müller, mein Name ist...' }
                ]
            },
            'objection-handling': {
                title: 'Einwandbehandlung',
                description: 'Der Kunde hat einen Einwand. Wie reagierst du?',
                messages: [
                    { type: 'customer', text: 'Das ist mir zu teuer.' },
                    { type: 'salesperson', text: 'Ich verstehe Ihre Bedenken...' }
                ]
            },
            'closing': {
                title: 'Abschluss',
                description: 'Es ist Zeit für den Abschluss. Wie gehst du vor?',
                messages: [
                    { type: 'customer', text: 'Das klingt interessant, aber ich muss noch überlegen.' },
                    { type: 'salesperson', text: 'Das verstehe ich. Was brauchen Sie noch, um eine Entscheidung zu treffen?' }
                ]
            }
        };

        const scenario = scenarios[scenario];
        document.getElementById('scenarioTitle').textContent = scenario.title;
        document.getElementById('scenarioDescription').textContent = scenario.description;
        document.getElementById('roleplayChat').style.display = 'block';
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        scenario.messages.forEach(msg => {
            this.addChatMessage(msg.type, msg.text);
        });
    }

    addChatMessage(type, text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage('salesperson', message);
            input.value = '';
            
            // Simulate customer response
            setTimeout(() => {
                const responses = [
                    'Das ist interessant, erzählen Sie mehr.',
                    'Hmm, ich weiß nicht...',
                    'Das klingt gut, aber...',
                    'Was kostet das denn?',
                    'Ich muss das mit meinem Team besprechen.'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addChatMessage('customer', randomResponse);
            }, 1000);
            
            this.addPoints(3);
        }
    }

    // Flashcard Functions
    flipFlashcard() {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.classList.toggle('flipped');
        }
    }

    nextCard() {
        const cards = this.getFlashcards();
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        document.getElementById('cardTerm').textContent = randomCard.term;
        document.getElementById('cardDefinition').textContent = randomCard.definition;
        document.getElementById('flashcard').classList.remove('flipped');
        this.addPoints(1);
    }

    markAsDifficult() {
        this.addPoints(2);
        this.nextCard();
    }

    markAsEasy() {
        this.addPoints(5);
        this.nextCard();
    }

    getFlashcards() {
        return [
            { term: 'BANT', definition: 'Budget, Authority, Need, Timeline - Die vier Kriterien für qualifizierte Leads' },
            { term: 'SPIN', definition: 'Situation, Problem, Implication, Need-payoff - Verkaufsmethode nach Neil Rackham' },
            { term: 'AIDA', definition: 'Attention, Interest, Desire, Action - Modell für Verkaufsgespräche' },
            { term: 'Gatekeeper', definition: 'Person, die den Zugang zum Entscheider kontrolliert' },
            { term: 'Pain Point', definition: 'Schmerzpunkt des Kunden, der gelöst werden muss' },
            { term: 'ROI', definition: 'Return on Investment - Rendite einer Investition' },
            { term: 'Value Proposition', definition: 'Einzigartiger Wertversprechen für den Kunden' },
            { term: 'Objection', definition: 'Einwand oder Bedenken des Kunden' },
            { term: 'Closing', definition: 'Abschluss des Verkaufsgesprächs' },
            { term: 'Follow-up', definition: 'Nachfassaktion nach einem Gespräch' }
        ];
    }

    // Progress and Achievement System
    addPoints(points) {
        this.progress.points += points;
        this.progress.level = Math.floor(this.progress.points / 100) + 1;
        this.updateDashboard();
        this.checkAchievements();
        this.saveProgress();
    }

    checkAchievements() {
        const newAchievements = [];
        
        if (this.progress.points >= 50 && !this.achievements.includes('first_points')) {
            newAchievements.push({ id: 'first_points', title: 'Erste Schritte', description: '50 Punkte erreicht!' });
        }
        
        if (this.progress.todayMinutes >= 10 && !this.achievements.includes('daily_learner')) {
            newAchievements.push({ id: 'daily_learner', title: 'Täglicher Lerner', description: '10 Minuten heute gelernt!' });
        }
        
        if (this.progress.streak >= 7 && !this.achievements.includes('week_streak')) {
            newAchievements.push({ id: 'week_streak', title: 'Wochenstreak', description: '7 Tage am Stück gelernt!' });
        }
        
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement.id);
            this.showAchievementNotification(achievement);
        });
        
        this.saveAchievements();
        this.updateAchievementDisplay();
    }

    showAchievementNotification(achievement) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <i class="fas fa-trophy"></i>
            <div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateAchievementDisplay() {
        const container = document.getElementById('achievements');
        container.innerHTML = '';
        
        const allAchievements = [
            { id: 'first_points', title: 'Erste Schritte', description: '50 Punkte erreicht!', icon: 'fas fa-star' },
            { id: 'daily_learner', title: 'Täglicher Lerner', description: '10 Minuten heute gelernt!', icon: 'fas fa-calendar-day' },
            { id: 'week_streak', title: 'Wochenstreak', description: '7 Tage am Stück gelernt!', icon: 'fas fa-fire' },
            { id: 'quiz_master', title: 'Quiz-Meister', description: '5 Quiz perfekt gelöst!', icon: 'fas fa-brain' },
            { id: 'objection_handler', title: 'Einwand-Experte', description: '20 Einwände gemeistert!', icon: 'fas fa-shield-alt' }
        ];
        
        allAchievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = `achievement ${this.achievements.includes(achievement.id) ? 'unlocked' : ''}`;
            div.innerHTML = `
                <i class="${achievement.icon}"></i>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            `;
            container.appendChild(div);
        });
    }

    // Quick Session Functions
    startQuickSession(type) {
        this.switchTab(type);
        this.startTimer();
    }

    // Local Storage Functions
    loadProgress() {
        const saved = localStorage.getItem('salesmaster_progress');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            todayMinutes: 0,
            streak: 0,
            level: 1,
            points: 0,
            quizScore: 0
        };
    }

    saveProgress() {
        localStorage.setItem('salesmaster_progress', JSON.stringify(this.progress));
    }

    loadAchievements() {
        const saved = localStorage.getItem('salesmaster_achievements');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    saveAchievements() {
        localStorage.setItem('salesmaster_achievements', JSON.stringify(this.achievements));
    }
}

// Global Functions for HTML onclick handlers
let salesMaster;

function showResponse() {
    salesMaster.showResponse();
}

function nextObjection() {
    salesMaster.nextObjection();
}

function showTips() {
    salesMaster.showTips();
}

function nextQuestion() {
    salesMaster.nextQuestion();
}

function selectQuizAnswer(btn) {
    salesMaster.selectQuizAnswer(btn);
}

function restartQuiz() {
    salesMaster.restartQuiz();
}

function sendMessage() {
    salesMaster.sendMessage();
}

function flipFlashcard() {
    salesMaster.flipFlashcard();
}

function nextCard() {
    salesMaster.nextCard();
}

function markAsDifficult() {
    salesMaster.markAsDifficult();
}

function markAsEasy() {
    salesMaster.markAsEasy();
}

function toggleTimer() {
    salesMaster.toggleTimer();
}

function startQuickSession(type) {
    salesMaster.startQuickSession(type);
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    salesMaster = new SalesMaster();
    
    // Initialize first content after a short delay to ensure DOM is ready
    setTimeout(() => {
        salesMaster.switchObjectionCategory('price');
        salesMaster.switchQuestionCategory('discovery');
        salesMaster.loadQuizQuestion(1);
        salesMaster.nextCard();
        salesMaster.updateAchievementDisplay();
    }, 100);
});

// Add CSS for achievement notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .achievement-notification {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .achievement-notification i {
        font-size: 2rem;
        color: #FFD700;
    }
`;
document.head.appendChild(style);

