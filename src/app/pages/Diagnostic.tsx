import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Brain, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useLearner } from '../contexts/LearnerContext';
import { updateLearnerProfile } from '../utils/learnerApi';
import { getSubjectData } from '../data/subjectData';

export default function Diagnostic() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const subjectData = getSubjectData(learner?.subject || 'programming');
  const questions = subjectData?.quizQuestions || [];
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleGeneratePlan = async () => {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const wrongQuestion = questions.find((question, index) => answers[index] !== question.correctAnswer);
    const weakConcept = wrongQuestion?.concept || questions[0]?.concept || '';
    const confidence = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

    updateLearner({
      diagnosticScore: score,
      diagnosticWeakConcept: weakConcept,
      diagnosticConfidence: confidence,
    });

    if (learner?.id) {
      setSaving(true);
      try {
        await updateLearnerProfile(learner.id, {
          profile: {
            diagnosticScore: score,
            diagnosticWeakConcept: weakConcept,
            diagnosticConfidence: confidence,
          },
        });
      } finally {
        setSaving(false);
      }
    }

    navigate('/personalized-plan');
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e40af] to-[#14b8a6] flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">Diagnostic Assessment</h1>
            <p className="text-gray-600">
              This quick assessment helps us understand your current knowledge level and identify areas to focus on.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 py-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1e40af]">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-[#14b8a6]">~5 min</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-[#a855f7]">Adaptive</div>
              <div className="text-sm text-gray-600">Personalized</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Your answers will shape your personalized learning path.</strong> There's no pass or fail - we just want to understand where you are right now.
            </p>
          </div>

          <Button size="lg" onClick={() => setStarted(true)} className="w-full">
            Start Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (completed) {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const weakConcepts = questions
      .filter((question, index) => answers[index] !== question.correctAnswer)
      .map((question) => question.concept);
    const weakConcept = weakConcepts[0] || questions[0]?.concept || 'Review needed';
    const confidence = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">Assessment Complete!</h1>
            <p className="text-gray-600">
              Great job! We've identified your strengths and areas for improvement.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-[#1e40af] to-[#14b8a6] rounded-xl text-white">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div className="text-lg">Readiness Score</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Strong Topics</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{questions.length - correctAnswers}</div>
                <div className="text-sm text-gray-600">To Improve</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-[#1e40af]">{confidence}</div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Identified Focus Areas:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm">{weakConcept}</span>
              </div>
            </div>
          </div>

          <Button size="lg" onClick={handleGeneratePlan} className="w-full" disabled={saving}>
            {saving ? 'Saving Score...' : 'Generate My Learning Plan'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-6">
      <div className="max-w-3xl mx-auto space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>~2 min remaining</span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="p-8 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[#1e40af] text-sm font-medium mb-4">
              {question.concept}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">{question.question}</h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-md hover:border-[#1e40af] transition-all"
                onClick={() => handleAnswer(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
