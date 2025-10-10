// Enhanced Quiz Engine - Advanced Sales Learning System
// Implementiert adaptive Quiz, Spaced Repetition, Gamification und Personalisierung

class EnhancedQuizEngine {
    constructor() {
        this.learningSystem = new AdvancedLearningSystem();
        this.currentQuiz = null;
        this.quizHistory = this.loadQuizHistory();
        this.userProgress = this.loadUserProgress();
        this.achievements = this.loadAchievements();
        this.streaks = this.loadStreaks();
        this.leaderboard = this.loadLeaderboard();
    }

    // ==================== ADAPTIVE QUIZ GENERATOR ====================
    
    startAdaptiveQuiz(topic, userLevel = null) {
        const quizConfig = this.learningSystem.generateAdaptiveQuiz(topic, userLevel);
        this.currentQuiz = this.createQuizInterface(quizConfig);
        this.showQuizInterface();
        
        // Analytics tracking
        this.learningSystem.analytics.trackLearningActivity({
            type: 'quiz_started',
            topic: topic,
            difficulty: quizConfig.difficulty,
            timestamp: new Date()
        });
    }

    createQuizInterface(quizConfig) {
        return {
            id: quizConfig.id,
            config: quizConfig,
            currentQuestion: 0,
            answers: [],
            startTime: Date.now(),
            timeRemaining: quizConfig.timeLimit * quizConfig.questionCount,
            score: 0,
            streak: 0,
            perfectStreak: 0
        };
    }

    showQuizInterface() {
        const quiz = this.currentQuiz;
        const question = quiz.config.questions[quiz.currentQuestion];
        
        const content = `
            <div class="enhanced-quiz-container">
                <div class="quiz-header">
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(quiz.currentQuestion / quiz.config.questions.length) * 100}%"></div>
                        </div>
                        <span class="progress-text">${quiz.currentQuestion + 1}/${quiz.config.questions.length}</span>
                    </div>
                    <div class="quiz-timer">
                        <i class="fas fa-clock"></i>
                        <span id="timeDisplay">${this.formatTime(quiz.timeRemaining)}</span>
                    </div>
                    <div class="quiz-score">
                        <i class="fas fa-star"></i>
                        <span>${quiz.score} XP</span>
                    </div>
                </div>
                
                <div class="question-container">
                    <div class="question-header">
                        <h3>${question.scenario || question.question}</h3>
                        <div class="question-meta">
                            <span class="difficulty-badge ${question.difficulty}">${this.getDifficultyLabel(question.difficulty)}</span>
                            <span class="points-badge">${question.points} XP</span>
                        </div>
                    </div>
                    
                    <div class="question-content">
                        ${this.renderQuestionContent(question)}
                    </div>
                    
                    <div class="question-actions">
                        <button class="btn-secondary" onclick="skipQuestion()">Überspringen</button>
                        <button class="btn-primary" onclick="submitAnswer()" id="submitBtn" disabled>Antworten</button>
                    </div>
                </div>
                
                <div class="quiz-footer">
                    <div class="streak-display">
                        <i class="fas fa-fire"></i>
                        <span>Streak: ${quiz.streak}</span>
                    </div>
                    <div class="perfect-streak">
                        <i class="fas fa-trophy"></i>
                        <span>Perfect: ${quiz.perfectStreak}</span>
                    </div>
                </div>
            </div>
        `;

        this.showModal(content, 'enhanced-quiz-modal');
        this.startTimer();
    }

    renderQuestionContent(question) {
        switch (question.type) {
            case 'multiple_choice':
                return this.renderMultipleChoice(question);
            case 'scenario_based':
                return this.renderScenarioBased(question);
            case 'role_play':
                return this.renderRolePlay(question);
            case 'case_study':
                return this.renderCaseStudy(question);
            default:
                return this.renderMultipleChoice(question);
        }
    }

    renderScenarioBased(question) {
        return `
            <div class="scenario-content">
                <div class="scenario-story">
                    <h4>📖 Situation:</h4>
                    <p>${question.scenario}</p>
                </div>
                <div class="scenario-question">
                    <h4>❓ Herausforderung:</h4>
                    <p>${question.question}</p>
                </div>
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <label class="option-card" onclick="selectOption(${index})">
                            <input type="radio" name="answer" value="${index}" onchange="enableSubmit()">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRolePlay(question) {
        return `
            <div class="roleplay-content">
                <div class="roleplay-scenario">
                    <h4>🎭 Rollenspiel:</h4>
                    <p>${question.scenario}</p>
                </div>
                <div class="roleplay-character">
                    <div class="character-info">
                        <img src="${question.character.avatar}" alt="${question.character.name}">
                        <div>
                            <h5>${question.character.name}</h5>
                            <p>${question.character.role}</p>
                            <p class="personality">${question.character.personality}</p>
                        </div>
                    </div>
                </div>
                <div class="roleplay-response">
                    <h4>💬 Ihre Antwort:</h4>
                    <textarea id="roleplayAnswer" placeholder="Wie reagieren Sie? Schreiben Sie Ihre Antwort..." rows="4"></textarea>
                </div>
            </div>
        `;
    }

    // ==================== SPACED REPETITION INTEGRATION ====================
    
    processQuizResult(quizResult) {
        const quiz = this.currentQuiz;
        const performance = this.calculatePerformance(quizResult);
        
        // Spaced Repetition für falsche Antworten
        quizResult.incorrectAnswers.forEach(questionId => {
            const review = this.learningSystem.spacedRepetition.scheduleReview(questionId, 0.3);
            this.scheduleReview(review);
        });

        // Adaptive Schwierigkeitsanpassung
        this.updateDifficultyPreference(performance);
        
        // Gamification
        const xp = this.calculateXP(quizResult);
        const achievements = this.checkAchievements(quizResult);
        
        this.updateUserProgress(xp, achievements);
        this.updateStreaks();
        this.updateLeaderboard(xp);
        
        this.showQuizResults(quizResult, xp, achievements);
    }

    calculatePerformance(quizResult) {
        const accuracy = quizResult.correctAnswers / quizResult.totalQuestions;
        const speed = this.calculateSpeedScore(quizResult);
        const consistency = this.calculateConsistencyScore(quizResult);
        
        return {
            overall: (accuracy + speed + consistency) / 3,
            accuracy: accuracy,
            speed: speed,
            consistency: consistency
        };
    }

    calculateSpeedScore(quizResult) {
        const averageTimePerQuestion = quizResult.totalTime / quizResult.totalQuestions;
        const optimalTime = this.getOptimalTimePerQuestion(quizResult.difficulty);
        
        if (averageTimePerQuestion <= optimalTime) return 1.0;
        if (averageTimePerQuestion <= optimalTime * 1.5) return 0.8;
        if (averageTimePerQuestion <= optimalTime * 2) return 0.6;
        return 0.4;
    }

    // ==================== GAMIFICATION FEATURES ====================
    
    calculateXP(quizResult) {
        let baseXP = 0;
        
        // Basis-XP für korrekte Antworten
        baseXP += quizResult.correctAnswers * 10;
        
        // Bonus für perfekte Runden
        if (quizResult.correctAnswers === quizResult.totalQuestions) {
            baseXP += 50; // Perfect Score Bonus
        }
        
        // Streak-Bonus
        const streakBonus = Math.min(this.streaks.current * 5, 100);
        baseXP += streakBonus;
        
        // Schwierigkeits-Bonus
        const difficultyMultiplier = this.getDifficultyMultiplier(quizResult.difficulty);
        baseXP = Math.floor(baseXP * difficultyMultiplier);
        
        // Speed-Bonus
        if (quizResult.speedBonus) {
            baseXP = Math.floor(baseXP * 1.5);
        }
        
        return baseXP;
    }

    checkAchievements(quizResult) {
        const newAchievements = [];
        
        // Quiz-spezifische Achievements
        if (quizResult.correctAnswers === quizResult.totalQuestions) {
            newAchievements.push('perfectionist');
        }
        
        if (quizResult.speedBonus) {
            newAchievements.push('speed_demon');
        }
        
        if (quizResult.correctAnswers >= quizResult.totalQuestions * 0.8) {
            newAchievements.push('consistent_performer');
        }
        
        // Streak-Achievements
        if (this.streaks.current >= 7) {
            newAchievements.push('streak_7');
        }
        
        if (this.streaks.current >= 30) {
            newAchievements.push('streak_30');
        }
        
        // Topic-spezifische Achievements
        if (quizResult.topic === 'objection_handling' && quizResult.accuracy >= 0.9) {
            newAchievements.push('objection_master');
        }
        
        return newAchievements;
    }

    updateStreaks() {
        const today = new Date().toDateString();
        const lastActivity = this.streaks.lastActivity;
        
        if (lastActivity === today) {
            // Bereits heute aktiv - kein Streak-Update
            return;
        }
        
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (lastActivity === yesterday) {
            // Kontinuierlicher Streak
            this.streaks.current += 1;
        } else {
            // Streak unterbrochen
            this.streaks.current = 1;
        }
        
        this.streaks.lastActivity = today;
        this.streaks.longest = Math.max(this.streaks.longest, this.streaks.current);
        
        this.saveStreaks();
    }

    // ==================== PERSONALIZATION FEATURES ====================
    
    personalizeQuizContent(question, userProfile) {
        const personalizedQuestion = { ...question };
        
        // Anpassung basierend auf Lernstil
        if (userProfile.learningStyle === 'visual') {
            personalizedQuestion.media = this.addVisualElements(question);
        }
        
        if (userProfile.learningStyle === 'auditory') {
            personalizedQuestion.audio = this.addAudioElements(question);
        }
        
        // Anpassung basierend auf Persönlichkeitstyp
        if (userProfile.personalityType === 'analytical') {
            personalizedQuestion.details = this.addAnalyticalDetails(question);
        }
        
        if (userProfile.personalityType === 'driver') {
            personalizedQuestion.action = this.addActionElements(question);
        }
        
        return personalizedQuestion;
    }

    getPersonalizedRecommendations() {
        const userProfile = this.learningSystem.userProfile;
        const weakTopics = this.identifyWeakTopics();
        const learningPath = this.getLearningPath();
        
        return {
            nextTopic: this.findNextInPath(learningPath, weakTopics),
            learningStyle: this.getOptimalLearningStyle(userProfile),
            difficulty: this.getOptimalDifficulty(userProfile),
            timeSlot: this.getOptimalTimeSlot(userProfile),
            resources: this.getRecommendedResources(weakTopics)
        };
    }

    // ==================== ANALYTICS & INSIGHTS ====================
    
    generateLearningInsights() {
        const insights = {
            performance: this.analyzePerformance(),
            strengths: this.identifyStrengths(),
            weaknesses: this.identifyWeaknesses(),
            recommendations: this.generateRecommendations(),
            predictions: this.generatePredictions()
        };
        
        return insights;
    }

    analyzePerformance() {
        const recentQuizzes = this.getRecentQuizzes(30); // Letzte 30 Tage
        
        return {
            averageScore: this.calculateAverageScore(recentQuizzes),
            improvement: this.calculateImprovement(recentQuizzes),
            consistency: this.calculateConsistency(recentQuizzes),
            speed: this.calculateAverageSpeed(recentQuizzes),
            engagement: this.calculateEngagement(recentQuizzes)
        };
    }

    identifyStrengths() {
        const topicPerformance = this.getTopicPerformance();
        return Object.entries(topicPerformance)
            .filter(([topic, performance]) => performance >= 0.8)
            .map(([topic, performance]) => ({
                topic: topic,
                performance: performance,
                recommendation: 'maintain'
            }));
    }

    identifyWeaknesses() {
        const topicPerformance = this.getTopicPerformance();
        return Object.entries(topicPerformance)
            .filter(([topic, performance]) => performance < 0.6)
            .map(([topic, performance]) => ({
                topic: topic,
                performance: performance,
                recommendation: 'focus_learning',
                priority: this.calculatePriority(topic, performance)
            }));
    }

    // ==================== UI ENHANCEMENTS ====================
    
    showQuizResults(quizResult, xp, achievements) {
        const performance = this.calculatePerformance(quizResult);
        const insights = this.generateLearningInsights();
        
        const content = `
            <div class="quiz-results-container">
                <div class="results-header">
                    <h2>🎉 Quiz abgeschlossen!</h2>
                    <div class="performance-summary">
                        <div class="score-display">
                            <span class="score-number">${quizResult.correctAnswers}/${quizResult.totalQuestions}</span>
                            <span class="score-percentage">${Math.round(performance.accuracy * 100)}%</span>
                        </div>
                        <div class="xp-earned">
                            <i class="fas fa-star"></i>
                            <span>+${xp} XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="performance-metrics">
                        <div class="metric">
                            <span class="metric-label">Genauigkeit</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${performance.accuracy * 100}%"></div>
                            </div>
                            <span class="metric-value">${Math.round(performance.accuracy * 100)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Geschwindigkeit</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${performance.speed * 100}%"></div>
                            </div>
                            <span class="metric-value">${Math.round(performance.speed * 100)}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Konsistenz</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${performance.consistency * 100}%"></div>
                            </div>
                            <span class="metric-value">${Math.round(performance.consistency * 100)}%</span>
                        </div>
                    </div>
                    
                    ${achievements.length > 0 ? `
                        <div class="achievements-earned">
                            <h3>🏆 Neue Erfolge!</h3>
                            <div class="achievement-list">
                                ${achievements.map(achievement => `
                                    <div class="achievement-item">
                                        <span class="achievement-icon">${this.achievements[achievement].icon}</span>
                                        <div>
                                            <span class="achievement-name">${this.achievements[achievement].name}</span>
                                            <span class="achievement-description">${this.achievements[achievement].description}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="insights-section">
                        <h3>📊 Deine Lern-Insights</h3>
                        <div class="insights-grid">
                            <div class="insight-card">
                                <h4>💪 Stärken</h4>
                                <ul>
                                    ${insights.strengths.map(strength => `
                                        <li>${strength.topic}: ${Math.round(strength.performance * 100)}%</li>
                                    `).join('')}
                                </ul>
                            </div>
                            <div class="insight-card">
                                <h4>🎯 Verbesserungsbereiche</h4>
                                <ul>
                                    ${insights.weaknesses.map(weakness => `
                                        <li>${weakness.topic}: ${Math.round(weakness.performance * 100)}%</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="recommendations">
                        <h3>🚀 Nächste Schritte</h3>
                        <div class="recommendation-list">
                            ${insights.recommendations.map(rec => `
                                <div class="recommendation-item">
                                    <span class="recommendation-priority">${rec.priority}</span>
                                    <span class="recommendation-text">${rec.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn-primary" onclick="startNextQuiz()">Nächstes Quiz</button>
                    <button class="btn-secondary" onclick="viewDetailedResults()">Detaillierte Ergebnisse</button>
                    <button class="btn-secondary" onclick="closeModal()">Schließen</button>
                </div>
            </div>
        `;
        
        this.showModal(content, 'quiz-results-modal');
    }

    // ==================== UTILITY FUNCTIONS ====================
    
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

    getDifficultyMultiplier(difficulty) {
        const multipliers = {
            'beginner': 1.0,
            'intermediate': 1.2,
            'advanced': 1.5,
            'expert': 2.0
        };
        return multipliers[difficulty] || 1.0;
    }

    loadQuizHistory() {
        const stored = localStorage.getItem('salesmaster_quiz_history');
        return stored ? JSON.parse(stored) : [];
    }

    saveQuizHistory() {
        localStorage.setItem('salesmaster_quiz_history', JSON.stringify(this.quizHistory));
    }

    loadUserProgress() {
        const stored = localStorage.getItem('salesmaster_user_progress');
        return stored ? JSON.parse(stored) : {
            level: 1,
            xp: 0,
            totalQuizzes: 0,
            averageScore: 0,
            topics: {}
        };
    }

    saveUserProgress() {
        localStorage.setItem('salesmaster_user_progress', JSON.stringify(this.userProgress));
    }

    loadAchievements() {
        const stored = localStorage.getItem('salesmaster_achievements');
        return stored ? JSON.parse(stored) : {};
    }

    saveAchievements() {
        localStorage.setItem('salesmaster_achievements', JSON.stringify(this.achievements));
    }

    loadStreaks() {
        const stored = localStorage.getItem('salesmaster_streaks');
        return stored ? JSON.parse(stored) : {
            current: 0,
            longest: 0,
            lastActivity: null
        };
    }

    saveStreaks() {
        localStorage.setItem('salesmaster_streaks', JSON.stringify(this.streaks));
    }

    loadLeaderboard() {
        const stored = localStorage.getItem('salesmaster_leaderboard');
        return stored ? JSON.parse(stored) : [];
    }

    saveLeaderboard() {
        localStorage.setItem('salesmaster_leaderboard', JSON.stringify(this.leaderboard));
    }
}

// ==================== EXPORT FOR USE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedQuizEngine;
} else {
    window.EnhancedQuizEngine = EnhancedQuizEngine;
}
