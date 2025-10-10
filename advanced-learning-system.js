// SalesMaster Advanced Learning System
// Adaptive, gamifiziertes Lernsystem für maximalen Lernerfolg

class AdvancedLearningSystem {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.learningData = this.loadLearningData();
        this.achievements = this.loadAchievements();
        this.streaks = this.loadStreaks();
        this.leaderboard = this.loadLeaderboard();
        this.spacedRepetition = new SpacedRepetitionSystem();
        this.adaptiveEngine = new AdaptiveLearningEngine();
        this.gamification = new GamificationEngine();
        this.analytics = new LearningAnalytics();
    }

    // ==================== ADAPTIVE QUIZ SYSTEM ====================
    
    generateAdaptiveQuiz(topic, difficulty = null) {
        const userLevel = this.adaptiveEngine.calculateUserLevel(topic);
        const targetDifficulty = difficulty || this.adaptiveEngine.getOptimalDifficulty(userLevel);
        
        const quizConfig = {
            topic: topic,
            difficulty: targetDifficulty,
            questionCount: this.getQuestionCount(targetDifficulty),
            timeLimit: this.getTimeLimit(targetDifficulty),
            questionTypes: this.getQuestionTypes(targetDifficulty),
            adaptiveScoring: true,
            spacedRepetition: true
        };

        return this.buildQuiz(quizConfig);
    }

    getQuestionCount(difficulty) {
        const counts = {
            beginner: 5,
            intermediate: 8,
            advanced: 12,
            expert: 15
        };
        return counts[difficulty] || 8;
    }

    getTimeLimit(difficulty) {
        const limits = {
            beginner: 30, // 30 Sekunden pro Frage
            intermediate: 25,
            advanced: 20,
            expert: 15
        };
        return limits[difficulty] || 25;
    }

    getQuestionTypes(difficulty) {
        const types = {
            beginner: ['multiple_choice', 'true_false'],
            intermediate: ['multiple_choice', 'scenario_based', 'situation_analysis'],
            advanced: ['scenario_based', 'role_play', 'case_study'],
            expert: ['complex_scenario', 'negotiation_simulation', 'objection_handling']
        };
        return types[difficulty] || ['multiple_choice', 'scenario_based'];
    }

    // ==================== SPACED REPETITION SYSTEM ====================
    
    class SpacedRepetitionSystem {
        constructor() {
            this.intervals = [1, 3, 7, 14, 30, 90]; // Tage
            this.difficultyFactors = [2.5, 2.0, 1.5, 1.0, 0.8, 0.6];
        }

        scheduleReview(questionId, performance) {
            const currentInterval = this.getCurrentInterval(questionId);
            const newInterval = this.calculateNextInterval(currentInterval, performance);
            
            return {
                questionId: questionId,
                nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
                interval: newInterval,
                difficulty: this.calculateDifficulty(performance)
            };
        }

        getCurrentInterval(questionId) {
            const review = this.learningData.reviews[questionId];
            return review ? review.interval : 1;
        }

        calculateNextInterval(currentInterval, performance) {
            if (performance >= 0.8) {
                return Math.min(currentInterval * 2, 90);
            } else if (performance >= 0.6) {
                return currentInterval;
            } else {
                return Math.max(1, Math.floor(currentInterval / 2));
            }
        }

        calculateDifficulty(performance) {
            if (performance >= 0.8) return Math.max(0.1, this.difficultyFactors[0] - 0.1);
            if (performance >= 0.6) return this.difficultyFactors[0];
            return Math.min(3.0, this.difficultyFactors[0] + 0.2);
        }
    }

    // ==================== ADAPTIVE LEARNING ENGINE ====================
    
    class AdaptiveLearningEngine {
        constructor() {
            this.learningPaths = {
                'objection_handling': {
                    beginner: ['basic_objections', 'price_objections'],
                    intermediate: ['time_objections', 'trust_objections'],
                    advanced: ['competition_objections', 'complex_objections'],
                    expert: ['multi_stakeholder', 'negotiation_objections']
                },
                'question_techniques': {
                    beginner: ['open_closed_questions', 'basic_spin'],
                    intermediate: ['advanced_spin', 'bant_qualification'],
                    advanced: ['consultative_selling', 'needs_analysis'],
                    expert: ['strategic_questioning', 'influence_techniques']
                }
            };
        }

        calculateUserLevel(topic) {
            const performance = this.analytics.getTopicPerformance(topic);
            const recentActivity = this.analytics.getRecentActivity(topic, 7); // 7 Tage
            
            if (performance >= 0.9 && recentActivity >= 5) return 'expert';
            if (performance >= 0.8 && recentActivity >= 3) return 'advanced';
            if (performance >= 0.6 && recentActivity >= 2) return 'intermediate';
            return 'beginner';
        }

        getOptimalDifficulty(userLevel) {
            const difficultyMap = {
                'beginner': 'beginner',
                'intermediate': 'intermediate', 
                'advanced': 'advanced',
                'expert': 'expert'
            };
            return difficultyMap[userLevel] || 'intermediate';
        }

        recommendNextTopic() {
            const weakTopics = this.analytics.getWeakTopics();
            const learningPath = this.getLearningPath();
            const nextTopic = this.findNextInPath(learningPath, weakTopics);
            
            return {
                topic: nextTopic,
                reason: this.getRecommendationReason(nextTopic),
                estimatedTime: this.getEstimatedTime(nextTopic),
                prerequisites: this.getPrerequisites(nextTopic)
            };
        }
    }

    // ==================== GAMIFICATION ENGINE ====================
    
    class GamificationEngine {
        constructor() {
            this.achievements = this.initializeAchievements();
            this.streaks = this.initializeStreaks();
            this.leaderboard = this.initializeLeaderboard();
        }

        initializeAchievements() {
            return {
                'first_quiz': { name: 'Erste Schritte', description: 'Erstes Quiz abgeschlossen', points: 10, icon: '🎯' },
                'streak_7': { name: 'Lernstreak', description: '7 Tage in Folge gelernt', points: 50, icon: '🔥' },
                'perfectionist': { name: 'Perfektionist', description: 'Quiz mit 100% abgeschlossen', points: 25, icon: '💯' },
                'speed_demon': { name: 'Blitzschnell', description: 'Quiz in Rekordzeit abgeschlossen', points: 30, icon: '⚡' },
                'objection_master': { name: 'Einwand-Meister', description: 'Alle Einwand-Übungen gemeistert', points: 100, icon: '🛡️' },
                'question_guru': { name: 'Fragen-Guru', description: 'SPIN-Selling Experte', points: 100, icon: '❓' },
                'scenario_hero': { name: 'Szenario-Held', description: '50 Szenarien erfolgreich', points: 150, icon: '🎭' },
                'sales_expert': { name: 'Verkaufs-Experte', description: 'Level 10 erreicht', points: 200, icon: '🏆' }
            };
        }

        checkAchievements(activity) {
            const newAchievements = [];
            
            // Quiz-basierte Achievements
            if (activity.type === 'quiz_completed') {
                if (activity.score === 100) {
                    newAchievements.push('perfectionist');
                }
                if (activity.timeBonus) {
                    newAchievements.push('speed_demon');
                }
            }

            // Streak-basierte Achievements
            if (this.streaks.current >= 7) {
                newAchievements.push('streak_7');
            }

            // Topic-spezifische Achievements
            if (activity.topic === 'objection_handling' && activity.mastery >= 0.9) {
                newAchievements.push('objection_master');
            }

            return newAchievements;
        }

        calculateXP(activity) {
            let baseXP = 0;
            
            // Basis-XP für Aktivität
            switch (activity.type) {
                case 'quiz_completed':
                    baseXP = activity.score * 2; // 0-200 XP
                    break;
                case 'scenario_completed':
                    baseXP = 50;
                    break;
                case 'lesson_completed':
                    baseXP = 25;
                    break;
            }

            // Multiplikatoren
            const streakMultiplier = 1 + (this.streaks.current * 0.1);
            const difficultyMultiplier = this.getDifficultyMultiplier(activity.difficulty);
            const timeBonus = activity.timeBonus ? 1.5 : 1;

            return Math.floor(baseXP * streakMultiplier * difficultyMultiplier * timeBonus);
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

        updateLeaderboard(userId, xp) {
            const entry = this.leaderboard.find(entry => entry.userId === userId);
            if (entry) {
                entry.xp += xp;
                entry.lastActivity = new Date();
            } else {
                this.leaderboard.push({
                    userId: userId,
                    xp: xp,
                    level: this.calculateLevel(xp),
                    lastActivity: new Date()
                });
            }
            
            this.leaderboard.sort((a, b) => b.xp - a.xp);
            this.saveLeaderboard();
        }

        calculateLevel(xp) {
            return Math.floor(xp / 1000) + 1;
        }
    }

    // ==================== MICRO-LEARNING MODULES ====================
    
    createMicroLearningModule(topic, duration = 5) {
        const modules = {
            'objection_handling': {
                'price_objection': {
                    title: 'Preis-Einwand in 5 Minuten',
                    duration: 5,
                    format: 'story_scenario',
                    content: {
                        story: 'Sie verkaufen ein CRM-System für 15.000€/Jahr. Der Kunde sagt: "Das ist mir zu teuer."',
                        challenge: 'Wie reagieren Sie?',
                        techniques: [
                            'Wert-Kommunikation: "Lassen Sie uns über den ROI sprechen..."',
                            'Kosten des Nicht-Handelns: "Was kostet Sie das aktuelle System?"',
                            'Zahlungspläne: "Wir können das in Raten anbieten"',
                            'ROI-Berechnung: "Die Amortisation erfolgt in 6 Monaten"'
                        ],
                        practice: 'Rollenspiel mit KI-Kunde'
                    }
                }
            },
            'question_techniques': {
                'spin_selling': {
                    title: 'SPIN-Selling in 5 Minuten',
                    duration: 5,
                    format: 'interactive_guide',
                    content: {
                        explanation: 'SPIN = Situation, Problem, Implication, Need-payoff',
                        examples: [
                            'Situation: "Wie läuft die Kundengewinnung aktuell?"',
                            'Problem: "Was bereitet Ihnen die größten Schwierigkeiten?"',
                            'Implication: "Was passiert, wenn Sie nichts ändern?"',
                            'Need-payoff: "Wie würde sich das für Sie auszahlen?"'
                        ],
                        practice: 'Interaktive Übung mit verschiedenen Kundentypen'
                    }
                }
            }
        };

        return modules[topic] || null;
    }

    // ==================== STORYTELLING SYSTEM ====================
    
    createStoryBasedScenario(topic, difficulty) {
        const scenarios = {
            'objection_handling': {
                'price_objection': {
                    title: 'Der schwierige Einkaufsleiter',
                    story: `
                        Sie sitzen im Büro von Herrn Müller, Einkaufsleiter bei TechCorp. 
                        Sie haben gerade Ihr neues CRM-System präsentiert - 15.000€/Jahr.
                        
                        Herr Müller lehnt sich zurück: "Das ist mir zu teuer. 
                        Wir haben bereits ein System für 5.000€/Jahr."
                        
                        Sie wissen: Das aktuelle System ist veraltet, verursacht 
                        täglich 2 Stunden manuellen Aufwand und kostet das Unternehmen 
                        monatlich 8.000€ an verlorenen Verkaufschancen.
                        
                        Wie reagieren Sie?
                    `,
                    options: [
                        'Sofort den Preis senken',
                        'Den Wert und ROI erklären',
                        'Das aktuelle System schlecht machen',
                        'Nach den versteckten Kosten fragen'
                    ],
                    correct: 3,
                    explanation: 'Die richtige Antwort ist, nach den versteckten Kosten zu fragen. Das öffnet die Tür für eine ROI-Diskussion.'
                }
            }
        };

        return scenarios[topic] || null;
    }

    // ==================== PERSONALIZATION ENGINE ====================
    
    class PersonalizationEngine {
        constructor() {
            this.learningStyles = ['visual', 'auditory', 'kinesthetic', 'reading'];
            this.personalityTypes = ['analytical', 'driver', 'expressive', 'amiable'];
        }

        analyzeUserBehavior(activities) {
            const analysis = {
                preferredTime: this.analyzePreferredTime(activities),
                learningStyle: this.analyzeLearningStyle(activities),
                difficultyPreference: this.analyzeDifficultyPreference(activities),
                topicInterests: this.analyzeTopicInterests(activities),
                engagementPatterns: this.analyzeEngagementPatterns(activities)
            };

            return analysis;
        }

        personalizeContent(content, userProfile) {
            const personalizedContent = { ...content };

            // Anpassung basierend auf Lernstil
            if (userProfile.learningStyle === 'visual') {
                personalizedContent.media = this.addVisualElements(content);
            } else if (userProfile.learningStyle === 'auditory') {
                personalizedContent.audio = this.addAudioElements(content);
            }

            // Anpassung basierend auf Persönlichkeitstyp
            if (userProfile.personalityType === 'analytical') {
                personalizedContent.details = this.addAnalyticalDetails(content);
            } else if (userProfile.personalityType === 'driver') {
                personalizedContent.action = this.addActionElements(content);
            }

            return personalizedContent;
        }

        recommendOptimalLearningTime(userProfile) {
            const analysis = this.analyzeUserBehavior(userProfile.activities);
            return {
                bestTime: analysis.preferredTime,
                duration: this.calculateOptimalDuration(analysis),
                frequency: this.calculateOptimalFrequency(analysis)
            };
        }
    }

    // ==================== ANALYTICS & TRACKING ====================
    
    class LearningAnalytics {
        constructor() {
            this.metrics = this.loadMetrics();
        }

        trackLearningActivity(activity) {
            const timestamp = new Date();
            const activityData = {
                ...activity,
                timestamp: timestamp,
                sessionId: this.getCurrentSessionId(),
                userAgent: navigator.userAgent,
                performance: this.calculatePerformance(activity)
            };

            this.metrics.activities.push(activityData);
            this.updateLearningMetrics(activityData);
            this.saveMetrics();
        }

        calculatePerformance(activity) {
            const factors = {
                accuracy: activity.score || 0,
                speed: this.calculateSpeedScore(activity),
                engagement: this.calculateEngagementScore(activity),
                retention: this.calculateRetentionScore(activity)
            };

            return {
                overall: (factors.accuracy + factors.speed + factors.engagement + factors.retention) / 4,
                factors: factors
            };
        }

        generateLearningInsights() {
            const insights = {
                strengths: this.identifyStrengths(),
                weaknesses: this.identifyWeaknesses(),
                recommendations: this.generateRecommendations(),
                progress: this.calculateProgress(),
                predictions: this.generatePredictions()
            };

            return insights;
        }

        identifyStrengths() {
            const topicPerformance = this.getTopicPerformance();
            return Object.entries(topicPerformance)
                .filter(([topic, performance]) => performance >= 0.8)
                .map(([topic, performance]) => ({ topic, performance }));
        }

        identifyWeaknesses() {
            const topicPerformance = this.getTopicPerformance();
            return Object.entries(topicPerformance)
                .filter(([topic, performance]) => performance < 0.6)
                .map(([topic, performance]) => ({ topic, performance }));
        }

        generateRecommendations() {
            const weaknesses = this.identifyWeaknesses();
            const learningPath = this.getLearningPath();
            
            return weaknesses.map(weakness => ({
                topic: weakness.topic,
                action: 'focus_learning',
                priority: this.calculatePriority(weakness),
                estimatedTime: this.getEstimatedTime(weakness.topic),
                resources: this.getRecommendedResources(weakness.topic)
            }));
        }
    }

    // ==================== ADVANCED QUIZ BUILDER ====================
    
    buildQuiz(config) {
        const questions = this.generateQuestions(config);
        const quiz = {
            id: this.generateQuizId(),
            config: config,
            questions: questions,
            metadata: {
                createdAt: new Date(),
                estimatedDuration: this.calculateEstimatedDuration(questions),
                difficulty: config.difficulty,
                topic: config.topic
            }
        };

        return quiz;
    }

    generateQuestions(config) {
        const questionBank = this.getQuestionBank(config.topic);
        const selectedQuestions = [];
        
        for (let i = 0; i < config.questionCount; i++) {
            const questionType = this.selectQuestionType(config.questionTypes);
            const question = this.createQuestion(questionType, config.topic, config.difficulty);
            selectedQuestions.push(question);
        }

        return selectedQuestions;
    }

    createQuestion(type, topic, difficulty) {
        const questionTemplates = {
            'multiple_choice': this.createMultipleChoiceQuestion,
            'scenario_based': this.createScenarioBasedQuestion,
            'role_play': this.createRolePlayQuestion,
            'case_study': this.createCaseStudyQuestion
        };

        return questionTemplates[type](topic, difficulty);
    }

    createScenarioBasedQuestion(topic, difficulty) {
        const scenarios = this.getScenarios(topic, difficulty);
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return {
            type: 'scenario_based',
            id: this.generateQuestionId(),
            scenario: scenario.story,
            question: scenario.question,
            options: scenario.options,
            correct: scenario.correct,
            explanation: scenario.explanation,
            difficulty: difficulty,
            topic: topic,
            timeLimit: this.getTimeLimit(difficulty),
            points: this.getPoints(difficulty)
        };
    }

    // ==================== UTILITY FUNCTIONS ====================
    
    loadUserProfile() {
        const stored = localStorage.getItem('salesmaster_user_profile');
        return stored ? JSON.parse(stored) : {
            level: 1,
            xp: 0,
            preferences: {},
            learningStyle: 'visual',
            personalityType: 'analytical',
            achievements: [],
            streaks: { current: 0, longest: 0 },
            lastActivity: null
        };
    }

    saveUserProfile() {
        localStorage.setItem('salesmaster_user_profile', JSON.stringify(this.userProfile));
    }

    loadLearningData() {
        const stored = localStorage.getItem('salesmaster_learning_data');
        return stored ? JSON.parse(stored) : {
            activities: [],
            reviews: {},
            progress: {},
            insights: {}
        };
    }

    saveLearningData() {
        localStorage.setItem('salesmaster_learning_data', JSON.stringify(this.learningData));
    }

    generateQuizId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateQuestionId() {
        return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getCurrentSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }
}

// ==================== EXPORT FOR USE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedLearningSystem;
} else {
    window.AdvancedLearningSystem = AdvancedLearningSystem;
}
