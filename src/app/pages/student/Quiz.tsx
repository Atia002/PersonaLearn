import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';
import { useLearner } from '../../contexts/LearnerContext';
import { getSubjectQuizQuestions } from '../../data/subjectData';

export default function Quiz() {
  const navigate = useNavigate();
  const { learner } = useLearner();
  const { id } = useParams();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Get quiz questions based on learner's subject
  const quizQuestions = learner?.subject 
    ? getSubjectQuizQuestions(learner.subject)
    : [];

  const question = quizQuestions[currentQuestion];

  if (!learner || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold">No Quiz Available</h2>
          <p className="text-gray-600">
            {!learner ? 'Please log in to access quizzes.' : 'No quiz questions found for your subject.'}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleAnswer = (optionIndex: number) => {
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    if (optionIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer('');
    } else {
      // Quiz complete - could navigate to results page
      navigate('/dashboard');
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm text-gray-600">
            Score: {score}/{quizQuestions.length}
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="p-8 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-[#1e40af] text-sm font-medium mb-4">
              {question.concept}
            </span>
            <h2 className="text-2xl font-bold">{question.question}</h2>
          </div>

          {question.code && (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{question.code}</code>
            </pre>
          )}

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correctAnswer;
              const isSelected = index === selectedAnswer;
              
              return (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    !answered 
                      ? 'hover:shadow-md hover:border-[#1e40af]' 
                      : isCorrect
                      ? 'border-2 border-green-500 bg-green-50'
                      : isSelected
                      ? 'border-2 border-red-500 bg-red-50'
                      : ''
                  }`}
                  onClick={() => !answered && handleAnswer(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                    {answered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {answered && (
            <div className={`p-4 rounded-lg ${selectedAnswer === question.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium mb-2">
                {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Not quite'}
              </p>
              <p className="text-sm text-gray-700">
                {question.explanation}
              </p>
              <Button className="mt-4" onClick={handleNext}>
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}