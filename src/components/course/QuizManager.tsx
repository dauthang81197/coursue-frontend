"use client";

import { useState, useEffect } from "react";
import { quizApi } from "@/lib/api/quiz";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import type { Quiz, CreateQuizQuestionDto } from "@/lib/types/course";

interface QuizManagerProps {
  lessonId: string;
  onDone: () => void;
  onSkip: () => void;
}

interface QuestionForm {
  text: string;
  options: string[];
  correctAnswer: string;
}

const emptyQuestion = (): QuestionForm => ({
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
});

export function QuizManager({ lessonId, onDone, onSkip }: QuizManagerProps) {
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // Load existing quiz if any
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setFetching(true);
        const quiz: Quiz = await quizApi.getByLesson(lessonId);
        if (quiz && quiz.questions && quiz.questions.length > 0) {
          setIsEdit(true);
          setQuestions(
            quiz.questions.map((q) => ({
              text: q.text,
              options: q.options.length >= 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill("")],
              correctAnswer: q.correctAnswer,
            })),
          );
        }
      } catch {
        // No quiz yet, use empty form
      } finally {
        setFetching(false);
      }
    };
    loadQuiz();
  }, [lessonId]);

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: string | string[]) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    // Validate
    for (const q of questions) {
      if (!q.text.trim()) {
        setError("All questions must have text");
        return;
      }
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setError("Each question must have at least 2 options");
        return;
      }
      if (!q.correctAnswer.trim()) {
        setError("Each question must have a correct answer");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const quizData = {
        lessonId,
        questions: questions.map(
          (q): CreateQuizQuestionDto => ({
            text: q.text,
            options: q.options.filter((o) => o.trim()),
            correctAnswer: q.correctAnswer,
          }),
        ),
      };

      if (isEdit) {
        await quizApi.update(lessonId, quizData);
      } else {
        await quizApi.create(quizData);
      }

      onDone();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save quiz";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading quiz...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {isEdit ? "Edit Quiz" : "Create Quiz"}
        </h3>
        <p className="text-sm text-gray-500">
          Students must score ≥ 60% to mark this lesson complete.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Question {qIdx + 1}</h4>
            {questions.length > 1 && (
              <button
                onClick={() => removeQuestion(qIdx)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          {/* Question text */}
          <Input
            label="Question"
            value={q.text}
            onChange={(e) => updateQuestion(qIdx, "text", e.target.value)}
            placeholder="e.g., How many keys does a piano have?"
          />

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Answer Options
            </label>
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-6 shrink-0">
                  {String.fromCharCode(65 + optIdx)}.
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Correct answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <select
              value={q.correctAnswer}
              onChange={(e) => updateQuestion(qIdx, "correctAnswer", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select correct answer...</option>
              {q.options
                .filter((o) => o.trim())
                .map((opt, i) => (
                  <option key={i} value={opt}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </option>
                ))}
            </select>
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
      >
        + Add Question
      </button>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Quiz" : "Save Quiz"}
        </Button>
      </div>
    </div>
  );
}

