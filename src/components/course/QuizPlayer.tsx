"use client";

import { useState, useEffect } from "react";
import { quizApi } from "@/lib/api/quiz";
import { Button } from "@/components/base/Button";
import type { Quiz, QuizSubmitResponse } from "@/lib/types/course";

interface QuizPlayerProps {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  onLessonComplete: () => void;
}

export function QuizPlayer({
  lessonId,
  isCompleted,
  onLessonComplete,
}: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quizApi.getByLesson(lessonId);
        setQuiz(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load quiz";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [lessonId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      alert(`Please answer all ${quiz.questions.length} questions before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      };

      const response = await quizApi.submit(lessonId, submitData);
      setResult(response);

      // Auto mark complete if score >= 60%
      const scorePercent = (response.score / response.total) * 100;
      if (scorePercent >= 60) {
        onLessonComplete();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit quiz";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-red-500 mb-3">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Failed to load quiz</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No quiz available for this lesson.</p>
        {!isCompleted && (
          <Button className="mt-4" onClick={onLessonComplete}>
            Mark as Complete
          </Button>
        )}
      </div>
    );
  }

  // Show results
  if (result) {
    const scorePercent = Math.round((result.score / result.total) * 100);
    const passed = scorePercent >= 60;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className={`text-center mb-8 p-6 rounded-xl ${passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className={`text-5xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
            {scorePercent}%
          </div>
          <p className={`text-lg font-semibold ${passed ? "text-green-700" : "text-red-700"}`}>
            {passed ? "🎉 Passed!" : "❌ Not Passed"}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {result.score} / {result.total} correct answers
          </p>
          {passed && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              ✅ Lesson marked as complete!
            </p>
          )}
          {!passed && (
            <p className="text-red-600 text-sm mt-2">
              You need at least 60% to pass. Try again!
            </p>
          )}
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Review Answers</h3>
          {quiz.questions.map((question, idx) => {
            const userAnswer = answers[question.id];
            const correct = result.correctAnswers.find(
              (ca) => ca.questionId === question.id,
            );
            const isCorrect = correct?.answer === userAnswer;

            return (
              <div
                key={question.id}
                className={`border rounded-lg p-4 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                <p className="font-medium text-gray-900 mb-2">
                  {idx + 1}. {question.text}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Your answer: </span>
                  <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                    {userAnswer || "—"}
                  </span>
                </p>
                {!isCorrect && correct && (
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Correct answer: </span>
                    <span className="text-green-700 font-medium">{correct.answer}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!passed && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        )}
      </div>
    );
  }

  // Show quiz
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">
            {answeredCount}/{totalQuestions} answered · Score ≥ 60% to pass
          </p>
        </div>
        {isCompleted && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            ✓ Already Passed
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions.map((question, idx) => (
          <div key={question.id} className="space-y-3">
            <p className="font-semibold text-gray-900">
              {idx + 1}. {question.text}
            </p>
            <div className="space-y-2">
              {question.options.map((option, optIdx) => (
                <label
                  key={optIdx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    answers[question.id] === option
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-500 mr-1">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting || answeredCount < totalQuestions}
        >
          {submitting
            ? "Submitting..."
            : answeredCount < totalQuestions
              ? `Answer all questions (${answeredCount}/${totalQuestions})`
              : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}

