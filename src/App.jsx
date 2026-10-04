import React, { useEffect, useMemo, useRef, useState } from "react";
import { QUESTION_BANK } from "./data/questions";

const defaultSetup = {
  role: "Frontend Developer",
  level: "Fresher",
  technology: "JavaScript",
  interviewType: "Technical",
  difficulty: "Medium",
  count: 5,
  voiceMode: false
};

function App() {
  const [page, setPage] = useState("home");
  const [setup, setSetup] = useState(defaultSetup);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(90);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const evaluatingRef = useRef(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("interviewHistory") || "[]"); }
    catch { return []; }
  });
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  const questions = useMemo(() => {
    const pool = QUESTION_BANK[setup.technology] || QUESTION_BANK.JavaScript;
    return pool.slice(0, setup.count);
  }, [setup]);

  useEffect(() => {
    if (page !== "interview") return;
    setSeconds(90);
    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(timer);
          if (!evaluatingRef.current) submitAnswer(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, page]);

  function startInterview() {
    setCurrent(0);
    setAnswers([]);
    setAnswer("");
    setPage("interview");
  }

  async function submitAnswer(auto = false) {
    if (evaluatingRef.current) return;
    const item = questions[current];
    if (!item) return;

    evaluatingRef.current = true;
    setIsEvaluating(true);

   try {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const response = await fetch(`${API_URL}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: item.question,
          answer: answer.trim() || (auto ? "No answer submitted." : "No answer submitted."),
          technology: setup.technology,
          role: setup.role,
          difficulty: setup.difficulty
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI evaluation failed.");
      }

      const evaluation = data.evaluation || {};
      const nextAnswers = [...answers, {
        question: item.question,
        answer: answer.trim() || "No answer submitted.",
        expected: item.expected,
        score: Number(evaluation.overallScore) || 0,
        evaluation
      }];

      setAnswers(nextAnswers);
      setAnswer("");

      if (current === questions.length - 1) {
        const total = Math.round(
          nextAnswers.reduce((sum, a) => sum + a.score, 0) / nextAnswers.length
        );
        const record = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          role: setup.role,
          technology: setup.technology,
          score: total,
          questions: questions.length
        };
        const updated = [record, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem("interviewHistory", JSON.stringify(updated));
        setPage("result");
      } else {
        setCurrent(v => v + 1);
      }
    } catch (error) {
      console.error(error);
      alert("AI evaluation failed. Please make sure the Gemini backend is running on port 5000.");
    } finally {
      evaluatingRef.current = false;
      setIsEvaluating(false);
    }
  }

  const overall = answers.length
    ? Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answers.length)
    : 0;

  return (
    <div className="app-shell">
      <header className="navbar">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark">IA</span>
          <span>Interview<span className="accent">AI</span></span>
        </button>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("history")}>History</button>
          <button className="theme-btn" onClick={() => setDark(v => !v)}>
            {dark ? "☀" : "☾"}
          </button>
        </nav>
      </header>

      <main>
        {page === "home" && <Home onStart={() => setPage("setup")} onHistory={() => setPage("history")} />}
        {page === "setup" && <Setup setup={setup} setSetup={setSetup} onBack={() => setPage("home")} onStart={startInterview} />}
        {page === "interview" && (
          <Interview
            question={questions[current]}
            index={current}
            total={questions.length}
            seconds={seconds}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={() => submitAnswer(false)}
            setup={setup}
            isEvaluating={isEvaluating}
          />
        )}
        {page === "result" && <Result score={overall} answers={answers} setup={setup} onRetry={startInterview} onHome={() => setPage("home")} />}
        {page === "history" && <History history={history} onStart={() => setPage("setup")} onHome={() => setPage("home")} />}
      </main>

      <footer>InterviewAI · Built with React · Practice smarter, interview better.</footer>
    </div>
  );
}

function Home({ onStart, onHistory }) {
  return (
    <section className="hero page">
      <div className="hero-copy">
        <div className="pill">AI-powered interview practice</div>
        <h1>Practice like it's a <span>real interview.</span></h1>
        <p>Prepare for technical interviews with timed questions, structured feedback, performance scoring, and interview history.</p>
        <div className="actions">
          <button className="primary" onClick={onStart}>Start Mock Interview →</button>
          <button className="secondary" onClick={onHistory}>View History</button>
        </div>
        <div className="trust-row">
          <span>✓ Role-based questions</span>
          <span>✓ Timed sessions</span>
          <span>✓ AI performance reports</span>
        </div>
      </div>
      <div className="hero-card">
        <div className="mini-top"><span>LIVE INTERVIEW</span><b>01:24</b></div>
        <div className="question-preview">
          <small>QUESTION 02 / 05</small>
          <h3>What is event delegation in JavaScript?</h3>
          <div className="answer-lines"><i></i><i></i><i></i></div>
        </div>
        <div className="score-preview">
          <div><strong>86%</strong><span>AI score</span></div>
          <div className="ring">86</div>
        </div>
      </div>
    </section>
  );
}

function Setup({ setup, setSetup, onBack, onStart }) {
  const update = (key, value) => setSetup({ ...setup, [key]: value });
  return (
    <section className="page narrow">
      <button className="back" onClick={onBack}>← Back</button>
      <div className="section-heading">
        <div className="pill">Interview setup</div>
        <h2>Build your interview</h2>
        <p>Customize your interview based on your target role, experience, technology, and difficulty.</p>
      </div>
      <div className="form-card">
        <label>Target role
          <select value={setup.role} onChange={e => update("role", e.target.value)}>
            <option>Frontend Developer</option><option>Software Engineer</option><option>Java Developer</option>
            <option>Python Developer</option><option>AI/ML Engineer</option><option>Data Scientist</option>
          </select>
        </label>
        <label>Experience level
          <select value={setup.level} onChange={e => update("level", e.target.value)}>
            <option>Fresher</option><option>Intermediate</option><option>Experienced</option>
          </select>
        </label>
        <label>Technology
          <select value={setup.technology} onChange={e => update("technology", e.target.value)}>
            <option>JavaScript</option><option>React</option><option>Java</option><option>Python</option>
          </select>
        </label>
        <label>Interview type
          <select value={setup.interviewType} onChange={e => update("interviewType", e.target.value)}>
            <option>Technical</option><option>HR</option><option>Mixed</option>
          </select>
        </label>
        <label>Difficulty
          <select value={setup.difficulty} onChange={e => update("difficulty", e.target.value)}>
            <option>Easy</option><option>Medium</option><option>Hard</option>
          </select>
        </label>
        <label>Number of questions
          <select value={setup.count} onChange={e => update("count", Number(e.target.value))}>
            <option value="3">3 Questions</option><option value="5">5 Questions</option>
            <option value="8">8 Questions</option><option value="10">10 Questions</option>
          </select>
        </label>
        <div className="toggle-row">
          <div><strong>Voice interview</strong><span>Answer questions using your microphone.</span></div>
          <button type="button" className={`toggle ${setup.voiceMode ? "active" : ""}`}
            onClick={() => update("voiceMode", !setup.voiceMode)}>
            <span></span>
          </button>
        </div>
        <div className="setup-summary">
          <div><span>ROLE</span><strong>{setup.role}</strong></div>
          <div><span>LEVEL</span><strong>{setup.level}</strong></div>
          <div><span>TYPE</span><strong>{setup.interviewType}</strong></div>
          <div><span>DIFFICULTY</span><strong>{setup.difficulty}</strong></div>
        </div>
        <button className="primary full" onClick={onStart}>Start Interview →</button>
      </div>
    </section>
  );
}

function Interview({ question, index, total, seconds, answer, setAnswer, onSubmit, setup, isEvaluating }) {
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = event => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(previous => previous.trim() ? `${previous.trim()} ${transcript}` : transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = event => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, [setAnswer]);

  function toggleVoice() {
    if (!voiceSupported) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  if (!question) return <section className="page narrow"><div className="empty"><h3>No question available.</h3></div></section>;

  return (
    <section className="page narrow">
      <div className="interview-header">
        <div>
          <span className="eyebrow">{setup.role} · {setup.technology}</span>
          <h2>{setup.interviewType === "HR" ? "HR Interview" : setup.interviewType === "Mixed" ? "Mixed Interview" : "Technical Interview"}</h2>
        </div>
        <div className="timer">◷ {mins}:{secs}</div>
      </div>

      <div className="progress"><span style={{ width: `${((index + 1) / total) * 100}%` }}></span></div>

      <div className="question-card">
        <div className="question-meta">
          <span>QUESTION {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <span>90 sec</span>
        </div>
        <h1>{question.question}</h1>
        <p className="hint">{question.hint}</p>

        <textarea value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here. Explain your approach clearly..."
          autoFocus disabled={isEvaluating} />

        <div className="voice-area">
          <button type="button" className={`voice-button ${isListening ? "listening" : ""}`}
            onClick={toggleVoice} disabled={isEvaluating}>
            <span className="mic-icon">{isListening ? "■" : "🎙"}</span>
            <span>{isListening ? "Stop Speaking" : "Start Speaking"}</span>
          </button>

          {isListening && <div className="listening-status"><span className="pulse-dot"></span>Listening... speak your answer</div>}
          {!voiceSupported && <div className="voice-warning">Voice recognition is not supported in this browser. Try Chrome or Edge.</div>}
        </div>

        <div className="answer-footer">
          <span>{answer.length} characters</span>
          <button className="primary" onClick={onSubmit} disabled={isEvaluating}>
            {isEvaluating ? "🤖 AI Evaluating..." : index === total - 1 ? "Finish Interview" : "Submit & Next →"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Result({ score, answers, setup, onRetry, onHome }) {
  const [expanded, setExpanded] = useState(0);

  const label = score >= 85 ? "Excellent" : score >= 70 ? "Strong performance" : score >= 50 ? "Keep practicing" : "Needs improvement";
  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D";

  const average = key => {
    const values = answers
      .map(a => Number(a.evaluation?.[key]))
      .filter(v => Number.isFinite(v));
    return values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;
  };

  const metrics = [
    { label: "Technical Knowledge", key: "technicalKnowledge", icon: "⚙" },
    { label: "Accuracy", key: "accuracy", icon: "✓" },
    { label: "Clarity", key: "clarity", icon: "◈" },
    { label: "Communication", key: "communication", icon: "◉" }
  ];

  const allStrengths = [...new Set(
    answers.flatMap(a => Array.isArray(a.evaluation?.strengths) ? a.evaluation.strengths : [])
  )].slice(0, 5);

  const allImprovements = [...new Set(
    answers.flatMap(a => Array.isArray(a.evaluation?.improvements) ? a.evaluation.improvements : [])
  )].slice(0, 5);

  const strongAnswers = answers.filter(a => a.score >= 70).length;
  const needsWork = answers.filter(a => a.score < 60).length;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  function printReport() {
    window.print();
  }

  return (
    <section className="page narrow result-page">
      <div className="result-topbar">
        <button className="back" onClick={onHome}>← Dashboard</button>
        <button className="secondary" onClick={printReport}>Print / Save PDF</button>
      </div>

      <div className="result-hero result-hero-pro">
        <div className="pill">✓ AI interview complete</div>
        <div className="result-heading-row">
          <div>
            <h1>{label}.</h1>
            <p>{setup.role} · {setup.technology} · {setup.difficulty} · {setup.level}</p>
            <span className="result-subtitle">Your answers were evaluated by InterviewAI using multiple performance dimensions.</span>
          </div>
          <div className="grade-badge">
            <span>GRADE</span>
            <strong>{grade}</strong>
          </div>
        </div>

        <div className="score-showcase">
          <div className="score-ring-wrap">
            <svg className="score-ring" viewBox="0 0 128 128" aria-label={`Overall score ${score} out of 100`}>
              <circle className="score-ring-bg" cx="64" cy="64" r="54" fill="none" strokeWidth="10" />
              <circle
                className="score-ring-value"
                cx="64"
                cy="64"
                r="54"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div className="score-ring-text">
              <strong>{score}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <div className="score-copy">
            <span className="eyebrow">OVERALL PERFORMANCE</span>
            <h2>{score >= 70 ? "You're interview-ready with room to grow." : "You're making progress — keep practicing."}</h2>
            <p>Use the analysis below to identify what you already do well and what to improve before your next interview.</p>
          </div>
        </div>
      </div>

      <div className="stats-grid result-stats">
        <div><b>{answers.length}</b><span>Questions evaluated</span></div>
        <div><b>{strongAnswers}</b><span>Strong answers</span></div>
        <div><b>{needsWork}</b><span>Answers to improve</span></div>
        <div><b>{Math.max(0, 100 - score)}</b><span>Growth points</span></div>
      </div>

      <div className="review-card result-section">
        <div className="result-section-heading">
          <div>
            <span className="eyebrow">PERFORMANCE BREAKDOWN</span>
            <h3>How you performed</h3>
          </div>
          <span className="section-note">AI evaluation</span>
        </div>
        <div className="ai-metrics metric-grid-pro">
          {metrics.map(metric => (
            <Metric key={metric.key} label={metric.label} value={average(metric.key)} icon={metric.icon} />
          ))}
        </div>
      </div>

      <div className="insight-grid">
        <div className="review-card insight-card strengths-card">
          <div className="insight-title"><span className="insight-icon">✓</span><h3>What you did well</h3></div>
          {allStrengths.length ? (
            <ul>{allStrengths.map((item, i) => <li key={i}>{item}</li>)}</ul>
          ) : (
            <p className="muted">Complete more interviews to build a stronger strengths profile.</p>
          )}
        </div>

        <div className="review-card insight-card improvement-card">
          <div className="insight-title"><span className="insight-icon">↗</span><h3>Focus areas</h3></div>
          {allImprovements.length ? (
            <ul>{allImprovements.map((item, i) => <li key={i}>{item}</li>)}</ul>
          ) : (
            <p className="muted">No major improvement areas were returned for this session.</p>
          )}
        </div>
      </div>

      <div className="review-card result-section">
        <div className="result-section-heading">
          <div>
            <span className="eyebrow">QUESTION-BY-QUESTION</span>
            <h3>Answer review</h3>
          </div>
          <span className="section-note">{answers.length} evaluated</span>
        </div>

        <div className="review-list-pro">
          {answers.map((a, i) => {
            const isOpen = expanded === i;
            const tone = a.score >= 80 ? "high" : a.score >= 60 ? "mid" : "low";
            return (
              <div className={`review-item-pro ${isOpen ? "open" : ""}`} key={i}>
                <button className="review-question" onClick={() => setExpanded(isOpen ? -1 : i)}>
                  <div className="question-number">{String(i + 1).padStart(2, "0")}</div>
                  <div className="question-title-wrap">
                    <span className="review-label">QUESTION {i + 1}</span>
                    <strong>{a.question}</strong>
                  </div>
                  <div className={`review-score ${tone}`}>{a.score}%</div>
                  <span className="chevron">{isOpen ? "⌃" : "⌄"}</span>
                </button>

                {isOpen && (
                  <div className="review-detail">
                    <div className="answer-block">
                      <span className="eyebrow">YOUR ANSWER</span>
                      <p>{a.answer || "No answer submitted."}</p>
                    </div>
                    {a.evaluation?.feedback && (
                      <div className="feedback-block">
                        <span className="eyebrow">AI FEEDBACK</span>
                        <p>{a.evaluation.feedback}</p>
                      </div>
                    )}
                    {a.evaluation?.betterAnswer && (
                      <div className="better-answer">
                        <span className="eyebrow">A STRONGER ANSWER</span>
                        <p>{a.evaluation.betterAnswer}</p>
                      </div>
                    )}
                    <div className="detail-columns">
                      <div>
                        <strong>Strengths</strong>
                        {a.evaluation?.strengths?.length ? (
                          <ul>{a.evaluation.strengths.map((x, j) => <li key={j}>{x}</li>)}</ul>
                        ) : <p className="muted">No specific strengths provided.</p>}
                      </div>
                      <div>
                        <strong>Improvements</strong>
                        {a.evaluation?.improvements?.length ? (
                          <ul>{a.evaluation.improvements.map((x, j) => <li key={j}>{x}</li>)}</ul>
                        ) : <p className="muted">No specific improvements provided.</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="review-card next-step-card">
        <div>
          <span className="eyebrow">NEXT STEP</span>
          <h3>Turn this feedback into progress.</h3>
          <p>Retake the interview with the same setup and aim to improve your weakest areas.</p>
        </div>
        <button className="primary" onClick={onRetry}>Practice Again →</button>
      </div>

      <div className="actions center result-actions">
        <button className="secondary" onClick={onHome}>Back to Dashboard</button>
        <button className="primary" onClick={onRetry}>Start Another Interview</button>
      </div>
    </section>
  );
}

function Metric({ label, value, icon }) {
  const tone = value >= 80 ? "high" : value >= 60 ? "mid" : "low";
  return (
    <div className={`metric metric-pro ${tone}`}>
      <div className="metric-head">
        <span className="metric-icon">{icon}</span>
        <div><span>{label}</span><strong>{value}%</strong></div>
      </div>
      <div className="metric-bar"><span style={{ width: `${value}%` }}></span></div>
    </div>
  );
}

function History({ history, onStart, onHome }) {
  return (
    <section className="page narrow">
      <button className="back" onClick={onHome}>← Home</button>
      <div className="section-heading">
        <div className="pill">Your progress</div>
        <h2>Interview history</h2>
        <p>Review your previous practice sessions.</p>
      </div>

      {!history.length ? (
        <div className="empty">
          <div className="empty-icon">◌</div>
          <h3>No interviews yet</h3>
          <p>Complete your first mock interview and your results will appear here.</p>
          <button className="primary" onClick={onStart}>Start First Interview</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div className="history-item" key={item.id}>
              <div><span className="eyebrow">{item.date}</span><h3>{item.role}</h3><p>{item.technology} · {item.questions} questions</p></div>
              <strong>{item.score}<small>/100</small></strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
