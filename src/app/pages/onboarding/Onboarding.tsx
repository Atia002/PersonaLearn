import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { 
  Target, 
  BookOpen, 
  Clock, 
  Zap, 
  Video,
  Heart,
  Brain,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles
} from 'lucide-react';
import WelcomeStep from './steps/WelcomeStep';
import GoalStep from './steps/GoalStep';
import SubjectStep from './steps/SubjectStep';
import TimeStep from './steps/TimeStep';
import PaceStep from './steps/PaceStep';
import PathStep from './steps/PathStep';
import HobbiesStep from './steps/HobbiesStep';
import ConfidenceStep from './steps/ConfidenceStep';
import ReviewStep from './steps/ReviewStep';
import { useLearner } from '../../contexts/LearnerContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    goal: learner?.goal || '',
    reason: learner?.reason || '',
    subject: learner?.subject || '',
    weeklyHours: learner?.weeklyHours || 5,
    studyDays: learner?.studyDays || [] as string[],
    sessionLength: learner?.sessionLength || 30,
    studyTime: learner?.studyTime || 'afternoon',
    pace: learner?.pace || 'balanced',
    pathPreference: learner?.pathPreference || 'mixed',
    hobbies: learner?.hobbies || [] as string[],
    confidence: learner?.confidence || 50,
    explanationLevel: learner?.explanationLevel || 'normal',
    supportMode: learner?.supportMode || 'balanced'
  });

  const totalSteps = 9;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    { icon: <Brain className="w-5 h-5" />, label: 'Welcome' },
    { icon: <Target className="w-5 h-5" />, label: 'Goal' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Subject' },
    { icon: <Clock className="w-5 h-5" />, label: 'Time' },
    { icon: <Zap className="w-5 h-5" />, label: 'Pace' },
    { icon: <Video className="w-5 h-5" />, label: 'Path' },
    { icon: <Heart className="w-5 h-5" />, label: 'Hobbies' },
    { icon: <Brain className="w-5 h-5" />, label: 'Confidence' },
    { icon: <Check className="w-5 h-5" />, label: 'Review' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save all onboarding data to learner profile before going to diagnostic
      updateLearner({
        goal: formData.goal,
        reason: formData.reason,
        subject: formData.subject as 'programming' | 'writing' | 'science',
        weeklyHours: formData.weeklyHours,
        studyDays: formData.studyDays,
        sessionLength: formData.sessionLength,
        studyTime: formData.studyTime,
        pace: formData.pace,
        pathPreference: formData.pathPreference,
        hobbies: formData.hobbies,
        confidence: formData.confidence,
        explanationLevel: formData.explanationLevel,
        supportMode: formData.supportMode,
      });
      navigate('/diagnostic');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <GoalStep data={formData} updateData={updateFormData} />;
      case 2:
        return <SubjectStep data={formData} updateData={updateFormData} />;
      case 3:
        return <TimeStep data={formData} updateData={updateFormData} />;
      case 4:
        return <PaceStep data={formData} updateData={updateFormData} />;
      case 5:
        return <PathStep data={formData} updateData={updateFormData} />;
      case 6:
        return <HobbiesStep data={formData} updateData={updateFormData} />;
      case 7:
        return <ConfidenceStep data={formData} updateData={updateFormData} />;
      case 8:
        return <ReviewStep data={formData} onEdit={(step) => setCurrentStep(step)} />;
      default:
        return null;
    }
  };

  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome step is always complete
      case 1:
        return formData.goal !== '';
      case 2:
        return formData.subject !== '';
      case 3:
        return formData.studyDays.length > 0;
      case 4:
        return formData.pace !== '';
      case 5:
        return formData.pathPreference !== '';
      case 6:
        return formData.hobbies.length > 0;
      case 7:
        return true; // Confidence step has a default
      case 8:
        return true; // Review step is always complete
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20">
      {/* Premium Header */}
      <div className="border-b bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#14b8a6] flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-[#1e40af] to-[#14b8a6] bg-clip-text text-transparent">
                  PersonaLearn
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  AI-Powered Personalization
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  Step {currentStep + 1} of {totalSteps}
                </div>
                <div className="text-xs text-gray-500">{steps[currentStep].label}</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2.5" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Getting to know you</span>
              <span>{totalSteps - currentStep - 1} steps remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Steps Indicator */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between relative">
          {/* Connection Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          ></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-3 relative">
              <button
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white scale-125 shadow-xl ring-4 ring-blue-100' 
                    : index < currentStep 
                    ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white scale-110 shadow-lg cursor-pointer hover:scale-115' 
                    : 'bg-gray-200 text-gray-400 scale-100'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </button>
              <div className="absolute top-full mt-2 whitespace-nowrap">
                <span className={`text-xs font-medium ${
                  index === currentStep 
                    ? 'text-blue-600' 
                    : index < currentStep 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 pb-12">
        <Card className="p-10 shadow-2xl border-gray-200 bg-white/80 backdrop-blur-sm">
          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          {currentStep !== 0 && (
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="gap-2 rounded-xl border-2 hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                {currentStep < totalSteps - 1 ? (
                  <>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={handleNext}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Skip
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                      className="gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="gap-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    Start Diagnostic
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Tips Card */}
        {currentStep > 0 && currentStep < totalSteps - 1 && (
          <Card className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <strong className="text-gray-900">Why we ask:</strong> This helps our AI create a truly personalized learning 
                experience. The more we know about your goals, preferences, and style, the better we can tailor lessons just for you.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}