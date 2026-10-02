import { useState, useRef, useCallback, useEffect } from 'react'

const API_URL = 'https://fwplj5ojl6.execute-api.ap-southeast-1.amazonaws.com/analyze'

// ─── Utility: Convert File to Base64 ────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Icon Components ────────────────────────────────────────────────────
function CameraIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  )
}

function SparklesIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  )
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function TrophyIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function XMarkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function LightBulbIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  )
}

function SpeakerWaveIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  )
}

function PauseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  )
}

// ─── Audio Tutor ────────────────────────────────────────────────────────
function AudioTutor({ audioBase64, isPlaying, onPlay, onStop }) {
  if (!audioBase64) return null

  return (
    <div className="glass-card rounded-2xl p-4 animate-slide-up flex items-center gap-4" style={{ animationDelay: '0.05s' }}>
      <button
        onClick={isPlaying ? onStop : onPlay}
        className={`relative p-3 rounded-xl transition-all duration-300 shrink-0 ${
          isPlaying
            ? 'bg-brand-500 shadow-lg shadow-brand-500/30 hover:bg-brand-400'
            : 'bg-brand-500/20 hover:bg-brand-500/30'
        }`}
        title={isPlaying ? 'Stop audio' : 'Listen to Audio Tutor'}
      >
        {isPlaying ? (
          <PauseIcon className="w-5 h-5 text-white" />
        ) : (
          <SpeakerWaveIcon className="w-5 h-5 text-brand-400" />
        )}
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-xl border-2 border-brand-400 animate-ping opacity-30" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">Audio Tutor</p>
        <p className="text-xs text-gray-400">
          {isPlaying ? 'Listening...' : 'Tap to hear the summary explained'}
        </p>
      </div>

      {/* Sound wave animation */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 h-6 shrink-0">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-1 bg-brand-400 rounded-full"
              style={{
                animation: 'sound-wave 0.8s ease-in-out infinite alternate',
                animationDelay: `${i * 0.1}s`,
                height: `${8 + Math.random() * 16}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Background Orbs ────────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient orb top-left */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
      {/* Gradient orb bottom-right */}
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl animate-pulse-glow" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
    </div>
  )
}

// ─── Loading Skeleton ───────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* AI thinking animation */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute inset-2 rounded-full bg-surface-card" />
            </div>
            <SparklesIcon className="absolute inset-0 m-auto w-8 h-8 text-brand-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">AI is analyzing your image...</h3>
        <p className="text-gray-400 text-sm">Generating summary & quiz questions</p>

        {/* Animated progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-brand-500"
              style={{
                animation: 'pulse-glow 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="h-5 w-32 bg-surface-hover rounded-lg animate-shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-hover rounded animate-shimmer" />
          <div className="h-3 w-5/6 bg-surface-hover rounded animate-shimmer" />
          <div className="h-3 w-4/6 bg-surface-hover rounded animate-shimmer" />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-surface-hover rounded-lg animate-shimmer" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 w-full bg-surface-hover rounded-xl animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

// ─── Summary Card ───────────────────────────────────────────────────────
function SummaryCard({ summary }) {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-brand-500/20">
          <BookOpenIcon className="w-5 h-5 text-brand-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Summary</h2>
      </div>
      <p className="text-gray-300 leading-relaxed text-[15px]">{summary}</p>
    </div>
  )
}

// ─── Quiz Section ───────────────────────────────────────────────────────
function QuizSection({ quiz, answers, score, onAnswer }) {
  const totalQuestions = quiz.length

  const handleSelect = (qIndex, option) => {
    if (answers[qIndex] !== undefined) return // already answered
    onAnswer(qIndex, option)
  }

  return (
    <div className="space-y-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-500/20">
            <SparklesIcon className="w-5 h-5 text-accent-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Quiz Time</h2>
        </div>
        {score !== null && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-600/30 to-accent-500/30 border border-brand-500/30 animate-scale-in">
            <TrophyIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-white">{score}/{totalQuestions}</span>
          </div>
        )}
      </div>

      {quiz.map((q, qIndex) => {
        const userAnswer = answers[qIndex]
        const isAnswered = userAnswer !== undefined
        const isCorrect = userAnswer === q.correctAnswer

        return (
          <div key={qIndex} className="glass-card rounded-2xl p-5 transition-all duration-300">
            <p className="text-white font-medium mb-4 flex gap-2">
              <span className="text-brand-400 font-bold min-w-[28px]">Q{qIndex + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2.5">
              {q.options.map((option, oIndex) => {
                const isSelected = userAnswer === option
                const isCorrectOption = option === q.correctAnswer
                let optionStyle = 'border-surface-hover hover:border-brand-500/40 hover:bg-surface-hover cursor-pointer'

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle = 'border-accent-500/50 bg-accent-500/10'
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-red-500/50 bg-red-500/10'
                  } else {
                    optionStyle = 'border-surface-hover opacity-50 cursor-default'
                  }
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, option)}
                    disabled={isAnswered}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 group ${optionStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isAnswered && isCorrectOption ? 'bg-accent-500 text-white' :
                      isSelected && !isCorrect ? 'bg-red-500 text-white' :
                      'bg-surface-hover text-gray-400 group-hover:bg-brand-500/30 group-hover:text-brand-300'
                    }`}>
                      {isAnswered && isCorrectOption ? <CheckCircleIcon className="w-4 h-4" /> :
                       isSelected && !isCorrect ? <XCircleIcon className="w-4 h-4" /> :
                       String.fromCharCode(65 + oIndex)}
                    </span>
                    <span className={`text-sm ${isAnswered && isCorrectOption ? 'text-accent-400 font-medium' : isSelected && !isCorrect ? 'text-red-400' : 'text-gray-300'}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
            {isAnswered && (
              <div className="mt-3 space-y-2 animate-scale-in">
                <div className={`px-4 py-2 rounded-lg text-sm ${isCorrect ? 'bg-accent-500/10 text-accent-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isCorrect ? '🎉 Correct!' : `❌ The correct answer is: ${q.correctAnswer}`}
                </div>
                {q.explanation && (
                  <div className="flex gap-2.5 px-4 py-3 rounded-lg bg-brand-500/5 border border-brand-500/10">
                    <LightBulbIcon className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Score summary */}
      {score !== null && (
        <div className="glass-card rounded-2xl p-6 text-center animate-confetti border-brand-500/30">
          <div className="text-4xl mb-3">{score === totalQuestions ? '🏆' : score >= totalQuestions / 2 ? '🌟' : '💪'}</div>
          <h3 className="text-xl font-bold text-white mb-1">
            {score === totalQuestions ? 'Perfect Score!' : score >= totalQuestions / 2 ? 'Great Job!' : 'Keep Learning!'}
          </h3>
          <p className="text-gray-400 text-sm">
            You got {score} out of {totalQuestions} questions correct
          </p>
          <div className="mt-4 h-2 rounded-full bg-surface-hover overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-1000 ease-out"
              style={{ width: `${(score / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Error Banner ───────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="glass-card rounded-2xl p-6 border-red-500/30 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-red-500/20 shrink-0">
          <XCircleIcon className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">Something went wrong</h3>
          <p className="text-gray-400 text-sm mb-4">{message}</p>
          <button
            onClick={onRetry}
            className="px-5 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors border border-red-500/20"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────
function formatTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

// ─── History Drawer ─────────────────────────────────────────────────────
function HistoryDrawer({ isOpen, onClose, history, onSelect, onDelete }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-surface-elevated border-l border-brand-500/10 z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-500/20">
                <ClockIcon className="w-4 h-4 text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">History</h2>
              {history.length > 0 && (
                <span className="text-xs text-gray-500 bg-surface-hover px-2 py-0.5 rounded-full">{history.length}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-hover text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                  <BookOpenIcon className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium mb-1">No history yet</p>
                <p className="text-gray-600 text-xs">Generated study guides will appear here</p>
              </div>
            ) : (
              history.map((entry, index) => (
                <button
                  key={entry.timestamp}
                  onClick={() => { onSelect(entry); onClose(); }}
                  className="w-full text-left glass-card rounded-xl p-3.5 hover:bg-surface-hover/80 transition-all duration-200 group"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {entry.imagePreview && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5">
                        <img src={entry.imagePreview} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate mb-1">
                        {entry.result.summary.slice(0, 60)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatTimeAgo(entry.timestamp)}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-brand-400">{entry.result.quiz?.length || 0} questions</span>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Clear All */}
          {history.length > 0 && (
            <div className="px-4 py-3 border-t border-white/5">
              <button
                onClick={onDelete}
                className="w-full py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Clear All History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────
export default function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizScore, setQuizScore] = useState(null)
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null) // tracks which history entry is active
  const [isPlaying, setIsPlaying] = useState(false)
  const [difficultyLevel, setDifficultyLevel] = useState('High School (Standard)')
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  // Utility: stop any currently playing audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snaplearn_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {
      // Corrupted data — start fresh
      localStorage.removeItem('snaplearn_history')
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('snaplearn_history', JSON.stringify(history))
    } catch {
      // Storage full — silently fail
    }
  }, [history])

  const handleImageSelect = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be under 5MB')
      return
    }

    setError(null)
    setResult(null)
    setQuizAnswers({})
    setQuizScore(null)
    setActiveHistoryIndex(null)
    stopAudio()
    const base64 = await fileToBase64(file)
    setImage(base64)
    setPreview(URL.createObjectURL(file))
  }, [stopAudio])

  const handleClearImage = useCallback(() => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setQuizAnswers({})
    setQuizScore(null)
    setActiveHistoryIndex(null)
    stopAudio()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [stopAudio])

  const handleGenerate = useCallback(async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    setResult(null)
    setQuizAnswers({})
    setQuizScore(null)
    setActiveHistoryIndex(null)
    stopAudio()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000) // 60s timeout

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64_image: image, difficultyLevel }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.error || `Server error (${response.status})`)
      }

      const text = await response.text()

      // The API returns a JSON string directly — try to parse it
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        // Sometimes the response might be wrapped — try extracting JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('Could not parse the AI response. Please try again.')
        }
      }

      if (!parsed.summary || !parsed.quiz) {
        throw new Error('Unexpected response format from the AI.')
      }

      setResult(parsed)

      // Auto-save to history (answers start empty, will be updated as user answers)
      setHistory(prev => [{
        timestamp: new Date().toISOString(),
        imagePreview: preview, // blob URL for current session; won't persist across page reloads but keeps localStorage small
        result: parsed,
        answers: {},
        score: null,
      }, ...prev].slice(0, 20)) // Keep max 20 entries
      setActiveHistoryIndex(0) // the entry we just created
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again with a smaller image.')
      } else {
        setError(err.message || 'An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }, [image, preview, stopAudio, difficultyLevel])

  const handleRetry = useCallback(() => {
    setError(null)
    if (image) handleGenerate()
  }, [image, handleGenerate])

  // Handle quiz answer — update local state AND persist to history entry
  const handleQuizAnswer = useCallback((qIndex, option) => {
    setQuizAnswers(prev => {
      const updated = { ...prev, [qIndex]: option }

      // Calculate score if all questions answered
      let newScore = null
      if (result?.quiz && Object.keys(updated).length === result.quiz.length) {
        newScore = result.quiz.reduce((acc, q, i) => acc + (updated[i] === q.correctAnswer ? 1 : 0), 0)
        setQuizScore(newScore)
      }

      // Persist answers into the active history entry
      if (activeHistoryIndex !== null) {
        setHistory(prev => prev.map((entry, i) =>
          i === activeHistoryIndex
            ? { ...entry, answers: updated, score: newScore !== null ? newScore : entry.score }
            : entry
        ))
      }

      return updated
    })
  }, [result, activeHistoryIndex])

  const handleHistorySelect = useCallback((entry) => {
    setResult(entry.result)
    setPreview(entry.imagePreview || null)
    setImage(null) // No re-upload needed for viewing
    setError(null)
    stopAudio()
    // Restore saved quiz answers and score
    setQuizAnswers(entry.answers || {})
    setQuizScore(entry.score ?? null)
    // Find the index of the selected entry so future answers get persisted back
    setActiveHistoryIndex(history.findIndex(h => h.timestamp === entry.timestamp))
  }, [history, stopAudio])

  const handleHistoryClear = useCallback(() => {
    setHistory([])
    setActiveHistoryIndex(null)
    stopAudio()
    localStorage.removeItem('snaplearn_history')
  }, [stopAudio])

  // Play audio from base64 string
  const handlePlayAudio = useCallback(() => {
    if (!result?.audio) return
    stopAudio()

    const audioSrc = result.audio.startsWith('data:')
      ? result.audio
      : `data:audio/mp3;base64,${result.audio}`

    const audio = new Audio(audioSrc)
    audioRef.current = audio
    setIsPlaying(true)

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      audioRef.current = null
    })

    audio.addEventListener('error', () => {
      setIsPlaying(false)
      audioRef.current = null
    })

    audio.play().catch(() => {
      setIsPlaying(false)
      audioRef.current = null
    })
  }, [result, stopAudio])

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryClear}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <header className="text-center mb-10 animate-slide-up relative">
          {/* History Button — top right */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="absolute right-0 top-0 p-2.5 rounded-xl glass-card hover:bg-surface-hover transition-colors group"
            title="View history"
          >
            <ClockIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-400 transition-colors" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-5">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-xs font-medium text-brand-300 tracking-wide">AI-Powered Learning</span>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-brand-200 to-accent-400 bg-clip-text text-transparent mb-3 tracking-tight">
            SnapLearn
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
            Snap a photo of any study material and let AI create a personalized study guide with quiz questions.
          </p>
        </header>

        {/* Upload Section */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          {!preview ? (
            <label className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-brand-500/40 hover:bg-surface-hover/50 group">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CameraIcon className="w-8 h-8 text-brand-400" />
              </div>
              <span className="text-white font-semibold mb-1">Upload or Capture</span>
              <span className="text-gray-500 text-xs">Tap to take a photo or choose from gallery</span>
              <span className="text-gray-600 text-xs mt-2">PNG, JPG, WEBP · Max 5MB</span>
            </label>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
              <div className="relative group">
                <img
                  src={preview}
                  alt="Uploaded material"
                  className="w-full max-h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 to-transparent" />
                <button
                  onClick={handleClearImage}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-red-500/50 transition-colors"
                  title="Remove image"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Difficulty Selector */}
              <div className="px-5 pt-4">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Difficulty Level</label>
                <div className="flex rounded-xl bg-surface/80 border border-white/5 p-1 gap-1">
                  {[
                    { value: 'Child (Simplified)', label: 'Child', emoji: '🧒' },
                    { value: 'High School (Standard)', label: 'Standard', emoji: '📚' },
                    { value: 'College (Advanced)', label: 'Advanced', emoji: '🎓' },
                  ].map(opt => {
                    const isActive = difficultyLevel === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setDifficultyLevel(opt.value)}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                            : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <div className="p-5 pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-accent-500 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/30 active:scale-[0.98]"
                >
                  <SparklesIcon className="w-5 h-5" />
                  {loading ? 'Analyzing...' : 'Generate Study Guide'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && !loading && <ErrorBanner message={error} onRetry={handleRetry} />}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-5">
            <SummaryCard summary={result.summary} />
            {result.audio && (
              <AudioTutor
                audioBase64={result.audio}
                isPlaying={isPlaying}
                onPlay={handlePlayAudio}
                onStop={stopAudio}
              />
            )}
            <QuizSection quiz={result.quiz} answers={quizAnswers} score={quizScore} onAnswer={handleQuizAnswer} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-gray-600 text-xs">
            Built with ❤️ using React, Tailwind CSS & AWS Bedrock AI
          </p>
        </footer>
      </div>
    </div>
  )
}
