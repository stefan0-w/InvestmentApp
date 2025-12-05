import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { quizQuestions, portfolioProfiles } from '../data/advisorData'; 
import api from '../api';
import '../styles/Advisor.css'; 

// Funkcja pomocnicza (bez zmian)
const calculateProfile = (answersMap) => {
  const totalScore = Object.values(answersMap).reduce((a, b) => a + b, 0);
  const horizonScore = answersMap[1]; // Pytanie ID 1 to horyzont

  if (horizonScore === 0) return portfolioProfiles.SAFE;
  if (totalScore <= 12) return portfolioProfiles.CONSERVATIVE;
  if (totalScore <= 22) return portfolioProfiles.BALANCED;
  return portfolioProfiles.DYNAMIC;
};

const Advisor = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await api.get('/api/advisor/save-profile/');
      
      const profileKey = response.data.profile_type;
      
      if (portfolioProfiles[profileKey]) {
        setResult(portfolioProfiles[profileKey]);
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error("Error fetching profile:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (score) => {
    const questionId = quizQuestions[currentStep].id;
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const profile = calculateProfile(newAnswers);
      setResult(profile);
      saveResultToBackend(profile.key);
    }
  };

  const saveResultToBackend = async (profileKey) => {
    try {
      const response = await api.post('/api/advisor/save-profile/', {
        profile_type: profileKey 
      });
      console.log('Profile saved successfully', response.data);
      
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
    }
};

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="advisor-container" style={{textAlign: 'center', padding: '50px'}}>
        <p>Loading your profile...</p>
      </div>
    );
  }


  if (result) {
    return (
      <div className="advisor-container">
        <div className="result-section">
          <h2 className="advisor-title">{result.title}</h2>
          <p className="advisor-description">{result.description}</p>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.allocation}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {result.allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="risk-badge">
            Risk Level: {result.riskLevel}
          </div>

          <br />

          <button onClick={restartQuiz} className="restart-btn">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- WIDOK PYTANIA ---
  const currentQuestion = quizQuestions[currentStep];

  return (
    <div className="advisor-container">
      <div className="question-section">
        <div className="question-counter">
          Question {currentStep + 1} of {quizQuestions.length}
        </div>
        
        <h3 className="question-text">{currentQuestion.question}</h3>
        
        {currentQuestion.description && (
          <p className="question-subtext">{currentQuestion.description}</p>
        )}

        <div className="answers-list">
          {currentQuestion.answers.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(ans.score)}
              className="answer-btn"
            >
              {ans.text}
            </button>
          ))}
        </div>
        
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="back-btn"
          >
            &larr; Back to previous question
          </button>
        )}
      </div>
    </div>
  );
};

export default Advisor;