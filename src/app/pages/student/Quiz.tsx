import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { CheckCircle, XCircle, Home } from 'lucide-react';
import { useLearner } from '../../contexts/LearnerContext';
import { getSubjectData, getSubjectQuizQuestions } from '../../data/subjectData';
import { updateLearnerProfile } from '../../utils/learnerApi';

function normalizeSubjectId(subject?: string): 'programming' | 'writing' | 'science' {
  if (!subject) {
    return 'science';
  }

  const normalized = subject.trim().toLowerCase();
  if (normalized.includes('program')) return 'programming';
  if (normalized.includes('writ')) return 'writing';
  if (normalized.includes('science')) return 'science';
  return 'science';
}

function normalizeConceptKey(value: string): string {
  return value.trim().toLowerCase().replace(/[-_]/g, ' ');
}

export default function Quiz() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const { id } = useParams();

  const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const subjectId = normalizeSubjectId(learner?.subject);
  const subject = getSubjectData(subjectId);
  const allQuestions = getSubjectQuizQuestions(subjectId);

  const conceptParam = useMemo(() => (id ? decodeURIComponent(id) : ''), [id]);
  const filteredByConcept = useMemo(() => {
    if (!conceptParam) return allQuestions;
    const conceptKey = normalizeConceptKey(conceptParam);
    return allQuestions.filter((q) => normalizeConceptKey(q.concept).includes(conceptKey));
  }, [allQuestions, conceptParam]);

  const quizQuestions = useMemo(() => {
    const pool = filteredByConcept.length > 0 ? filteredByConcept : allQuestions;
    return pool.slice(0, 5);
  }, [allQuestions, filteredByConcept]);

  useEffect(() => {
    setSelectedAnswers(Array.from({ length: quizQuestions.length }, () => null));
    setSubmitted(false);
    setScore(0);
  }, [quizQuestions.length]);

  const answeredCount = selectedAnswers.filter((answer) => answer !== null).length;
  const progress = quizQuestions.length > 0 ? (answeredCount / quizQuestions.length) * 100 : 0;
  const allAnswered = quizQuestions.length > 0 && answeredCount === quizQuestions.length;

  const selectedConceptLabel = conceptParam
    ? conceptParam
    : quizQuestions[0]?.concept
      ? 'Mixed Concepts'
      : 'General';

  if (!quizQuestions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold">No Quiz Available</h2>
          <p className="text-gray-600">
            No quiz questions were found for this subject.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const nextAnswers = [...selectedAnswers];
    nextAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(nextAnswers);
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitted) return;

    const correctCount = quizQuestions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    setScore(correctCount);
    setSubmitted(true);

    const missedQuestions = quizQuestions.filter((question, index) => selectedAnswers[index] !== question.correctAnswer);
    const conceptMisses = missedQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.concept] = (acc[question.concept] || 0) + 1;
      return acc;
    }, {});

    const weakConcept = Object.entries(conceptMisses).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
    const completedAt = new Date().toISOString();

    updateLearner((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        quizScore: scorePercent,
        lastQuizConcept: selectedConceptLabel,
        quizWeakConcept: weakConcept,
        quizCompletedAt: completedAt,
      };
    });

    if (learner?.id) {
      try {
        await updateLearnerProfile(learner.id, {
          profile: {
            quizScore: scorePercent,
            lastQuizConcept: selectedConceptLabel,
            quizWeakConcept: weakConcept,
            quizCompletedAt: completedAt,
          },
        });
      } catch (error) {
        console.warn('Failed to save quiz results:', error);
      }
    }
  };

  const missedQuestions = submitted
    ? quizQuestions.filter((question, index) => selectedAnswers[index] !== question.correctAnswer)
    : [];
  const weakConcept = submitted
    ? Object.entries(
        missedQuestions.reduce<Record<string, number>>((acc, question) => {
          acc[question.concept] = (acc[question.concept] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    : '';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Subject: {subject?.name || 'Science'}</span>
          <span className="text-sm text-gray-600">
            Concept: {selectedConceptLabel}
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="text-sm text-gray-600">
          Answered {answeredCount}/{quizQuestions.length}
        </div>

        {!submitted ? (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Practice Assessment</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete all {quizQuestions.length} questions, then submit to get your score and recommendation.
              </p>
            </div>

            <div className="space-y-5">
              {quizQuestions.map((question, questionIndex) => (
                <Card key={question.id} className="p-5 space-y-4 border border-gray-200">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[#1e40af] text-xs font-medium">
                      {question.concept}
                    </span>
                    <h3 className="font-semibold">
                      {questionIndex + 1}. {question.question}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[questionIndex] === optionIndex;
                      return (
                        <button
                          type="button"
                          key={optionIndex}
                          onClick={() => handleAnswer(questionIndex, optionIndex)}
                          className={`w-full p-3 text-left border rounded-lg transition-all ${
                            isSelected
                              ? 'border-[#1e40af] bg-blue-50'
                              : 'border-gray-200 hover:border-[#1e40af] hover:bg-blue-50/50'
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} disabled={!allAnswered}>
                Submit Quiz
              </Button>
              {!allAnswered && (
                <span className="text-sm text-gray-600">Answer all questions to submit.</span>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Quiz Results</h2>
              <div className="text-lg font-semibold text-[#1e40af]">
                Score: {score}/{quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
              </div>
              <p className="text-gray-700">
                {weakConcept
                  ? `Recommendation: Review ${weakConcept} next to improve your accuracy.`
                  : 'Recommendation: Great work. Continue with the next lesson for this subject.'}
              </p>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const selectedAnswer = selectedAnswers[index];
                const isCorrect = selectedAnswer === question.correctAnswer;
                return (
                  <Card key={question.id} className="p-5 space-y-3 border border-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{index + 1}. {question.question}</h3>
                        <p className="text-xs text-gray-500 mt-1">Concept: {question.concept}</p>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      Your answer: {selectedAnswer !== null ? question.options[selectedAnswer] : 'Not answered'}
                    </p>
                    <p className="text-sm text-gray-700">
                      Correct answer: {question.options[question.correctAnswer]}
                    </p>
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => navigate('/lesson/1')}>Go to Lesson / Tutor</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}