import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import '../styles/eight-ball.css';

const ANSWERS = {
  positive: [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes'
  ],
  noncommittal: [
    'Reply hazy, try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again'
  ],
  negative: [
    "Don't count on it",
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
  ]
};

export default function EightBall() {
  const [phase, setPhase] = useState('intro'); // intro, shaking, answer
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [answerType, setAnswerType] = useState('');
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const shakeTimeoutRef = useRef(null);
  const ballRef = useRef(null);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const getRandomAnswer = () => {
    const allAnswers = [...ANSWERS.positive, ...ANSWERS.noncommittal, ...ANSWERS.negative];
    const types = ['positive', 'noncommittal', 'negative'];
    const type = types[Math.floor(Math.random() * types.length)];
    const answer = ANSWERS[type][Math.floor(Math.random() * ANSWERS[type].length)];
    return { answer, type };
  };

  const askQuestion = () => {
    if (!question.trim()) {
      alert('Please ask a question!');
      return;
    }

    setPhase('shaking');

    // Add shake animation effect
    if (ballRef.current) {
      ballRef.current.classList.add('shake');
    }

    // Simulate shaking duration
    shakeTimeoutRef.current = setTimeout(() => {
      const { answer, type } = getRandomAnswer();
      setCurrentAnswer(answer);
      setAnswerType(type);
      setPhase('answer');
      setTotal(total + 1);

      // Add to history
      setHistory([
        ...history,
        { question, answer, type }
      ]);

      if (ballRef.current) {
        ballRef.current.classList.remove('shake');
      }
    }, 2000);
  };

  const reset = () => {
    setPhase('intro');
    setQuestion('');
    setCurrentAnswer('');
    setAnswerType('');
  };

  const clearHistory = () => {
    setHistory([]);
    setTotal(0);
    reset();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && phase === 'intro') {
      askQuestion();
    }
  };

  return (
    <div className="eight-ball-page">
      {/* Header */}
      <section className="hero-page section">
        <div className="container">
          <motion.div
            style={{ textAlign: 'center', gap: 16 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>🎱 Magic 8-Ball</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
              Ask the magic 8-ball any yes-or-no question and let fate decide your answer
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Game Area */}
      <section className="section">
        <div className="container">
          <div className="eight-ball-container">
            {/* Ball */}
            <motion.div
              ref={ballRef}
              className={`eight-ball ${phase === 'shaking' ? 'shaking' : ''} ${answerType}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <div className="ball-inner">
                {phase === 'intro' && <div className="ball-text">🎱</div>}
                {phase === 'shaking' && <div className="ball-text">?</div>}
                {phase === 'answer' && (
                  <motion.div
                    className={`ball-answer ${answerType}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <span>{currentAnswer}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Input & Controls */}
            <motion.div
              className="input-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {phase === 'intro' && (
                <>
                  <input
                    type="text"
                    placeholder="Ask me a yes or no question..."
                    value={question}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="question-input"
                    autoFocus
                  />
                  <button onClick={askQuestion} className="btn btn-primary ask-btn">
                    Ask the Ball
                  </button>
                </>
              )}

              {phase === 'shaking' && (
                <p className="status-text">🌀 The ball is thinking...</p>
              )}

              {phase === 'answer' && (
                <motion.div
                  className="answer-display"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="question-label">You asked:</p>
                  <p className="asked-question">"{question}"</p>
                  <div className={`answer-box ${answerType}`}>
                    <p className="answer-text">{currentAnswer}</p>
                  </div>
                  <button onClick={reset} className="btn btn-primary ask-again-btn">
                    Ask Another Question
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats & History */}
      {total > 0 && (
        <section className="section section--dark">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ marginBottom: 32 }}>📊 Question History</h2>

              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-label">Total Questions</span>
                  <span className="stat-number">{total}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Positive Answers</span>
                  <span className="stat-number">{history.filter(h => h.type === 'positive').length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Uncertain Answers</span>
                  <span className="stat-number">{history.filter(h => h.type === 'noncommittal').length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Negative Answers</span>
                  <span className="stat-number">{history.filter(h => h.type === 'negative').length}</span>
                </div>
              </div>

              {history.length > 0 && (
                <>
                  <div className="history-list">
                    {history.map((entry, idx) => (
                      <motion.div
                        key={idx}
                        className={`history-item ${entry.type}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="history-q">
                          <span className="history-num">Q{idx + 1}</span>
                          <span className="history-question">{entry.question}</span>
                        </div>
                        <div className={`history-a ${entry.type}`}>
                          {entry.answer}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button onClick={clearHistory} className="btn btn-outline clear-btn">
                    Clear History
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
