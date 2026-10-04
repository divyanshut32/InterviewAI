# InterviewAI 🤖

> An AI-powered mock interview platform that helps candidates practice technical interviews, receive real-time AI evaluation, and understand their strengths and improvement areas.

## 🚀 Overview

InterviewAI is a full-stack AI-powered mock interview application designed to simulate realistic technical interviews.

Users can select their target role, experience level, technology, interview type, difficulty, and number of questions. During the interview, candidates answer questions under a time limit and receive AI-powered evaluation with scores, feedback, strengths, improvements, and a better example answer.

The application combines a modern React frontend with an Express backend and Google's Gemini AI for intelligent answer evaluation.

---

## ✨ Features

### 🎯 Interview Setup

- Select target job role
- Select experience level
- Select technology
- Technical / HR / Mixed interview modes
- Easy / Medium / Hard difficulty
- Configurable number of questions
- Optional voice-answer mode

### ⏱️ Timed Interviews

- 90-second timer for each question
- Automatic submission when the timer expires
- Question-by-question interview flow
- Progress tracking

### 🤖 AI-Powered Evaluation

Each answer is evaluated using Gemini AI based on:

- Technical knowledge
- Accuracy
- Clarity
- Communication
- Relevance
- Practical understanding

### 📊 Performance Report

After completing an interview, users receive:

- Overall score
- Performance grade
- Technical knowledge score
- Accuracy score
- Clarity score
- Communication score
- Strengths
- Areas for improvement
- AI feedback
- Example of a stronger answer
- Question-by-question review

### 🎤 Voice Answer Support

InterviewAI supports browser-based speech recognition for answering questions using voice.

### 📚 Interview History

Previous interview results are stored locally so users can review their performance.

### 🌓 Modern UI

- Responsive design
- Dark / light mode
- Mobile-friendly interface
- Professional dashboard
- Interactive performance report

### 🖨️ Report Export

Interview results can be printed or saved as a PDF using the browser's print functionality.

---

## 🧠 AI Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│                          │
│ Interview Setup          │
│ Questions                │
│ Answer Input             │
│ Performance Report       │
└────────────┬─────────────┘
             │
             │ HTTP POST
             ▼
┌──────────────────────────┐
│     Express Backend      │
│                          │
│ /api/evaluate            │
│ Request Validation       │
│ Gemini API Integration   │
└────────────┬─────────────┘
             │
             │ Prompt
             ▼
┌──────────────────────────┐
│       Gemini AI          │
│                          │
│ Answer Evaluation        │
│ Scoring                  │
│ Feedback                 │
│ Better Answer            │
└────────────┬─────────────┘
             │
             │ JSON Response
             ▼
┌──────────────────────────┐
│      Result Dashboard    │
│                          │
│ Scores                   │
│ Strengths                │
│ Improvements             │
│ AI Feedback              │
└──────────────────────────┘