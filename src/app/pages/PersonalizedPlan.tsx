import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Brain, Sparkles, Clock, Target, TrendingUp, Calendar, ArrowRight, CheckCircle, Zap, Heart, BookOpen, Flame } from 'lucide-react';
import PersonaProfile from '../components/PersonaProfile';
import { useLearner } from '../contexts/LearnerContext';
import { generateLearningPlan } from '../utils/learnerApi';

type GeneratedPlan = {
  goal?: string;
  subject?: string;
  weakConcept?: string;
  summary?: string;
  weeklyHours?: number;
  sessionLength?: number;
  sessionsPerWeek?: number;
  weeklyPlan?: Array<{ day: string; concept: string; taskTitle: string; estimatedMinutes: number; supportLevel: string; reason: string; status: string; recommendedResourceType: string }>;
  planItems?: Array<{ day: string; concept: string; taskTitle: string; estimatedMinutes: number; supportLevel: string; reason: string; status: string; recommendedResourceType: string }>;
  personalization?: { hobbies?: string[]; studyTime?: string; pace?: string; supportMode?: string; confidence?: number; explanationLevel?: string };
  rationale?: { text?: string; weakConceptFirst?: boolean };
  nextLesson?: { concept?: string; taskTitle?: string; estimatedMinutes?: number; reason?: string };
  freeResources?: { wikipedia?: { title?: string; summary?: string; url?: string }; openLibraryBooks?: Array<{ title?: string; author?: string; url?: string }> };
};

export default function PersonalizedPlan() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState('');
  const planItems = plan?.planItems?.length ? plan.planItems : (plan?.weeklyPlan || []);

  useEffect(() => {
    const loadPlan = async () => {
      if (!learner) {
        setError('No learner profile found. Please sign up or log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await generateLearningPlan(learner);
        setPlan(response.plan as GeneratedPlan);
        updateLearner({ generatedPlan: response.plan });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to generate plan right now.');
      }
    };

    void loadPlan();

    // Keep the progress animation while the backend request resolves.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center p-6">
        <Card className="max-w-3xl w-full p-10 space-y-8 text-center shadow-2xl">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#14b8a6] flex items-center justify-center mx-auto animate-pulse shadow-xl">
            <Brain className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Building Your Perfect Learning Path...</h2>
            <p className="text-gray-600 text-lg">Our AI is analyzing your profile and creating a personalized experience</p>
          </div>

          <div className="space-y-3">
            <Progress value={progress} className="h-3" />
            <p className="text-sm font-medium text-gray-600">{progress}% Complete</p>
          </div>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">Adjusting pace to your preferences...</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200 animate-pulse" style={{animationDelay: '0.3s'}}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">Selecting hobby-aware examples...</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 animate-pulse" style={{animationDelay: '0.6s'}}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">Creating your weekly schedule...</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200 animate-pulse" style={{animationDelay: '0.9s'}}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">Matching lessons to your skill level...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center p-6">
        <Card className="max-w-xl w-full p-8 space-y-4 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Plan generation failed</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => navigate('/diagnostic')} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        {/* Hero Section */}
        <Card className="p-10 text-center space-y-6 shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#14b8a6] flex items-center justify-center mx-auto shadow-xl mb-6">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="inline-block mb-4">
              <Badge className="bg-green-500 text-white text-sm px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Plan Ready!
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Learning Plan is Ready!</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Based on your profile and diagnostic, this prototype adaptive plan starts with <strong>{plan?.weakConcept || learner?.diagnosticWeakConcept || 'your weakest concept'}</strong> and adjusts the schedule to your pace, support mode, and available time.
            </p>
          </div>
        </Card>

        {/* Persona Profile */}
        <Card className="p-8 shadow-lg border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Learning Profile</h2>
          </div>
          <PersonaProfile variant="full" />
        </Card>

        {/* Plan Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 space-y-5 shadow-lg hover:shadow-xl transition-all border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Your Learning Goal</h3>
                <p className="text-lg font-semibold text-blue-600 mb-3">{plan?.goal || learner?.goal || 'Exam Preparation'}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The backend created this prototype adaptive plan from your profile and diagnostic weak concept.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-5 shadow-lg hover:shadow-xl transition-all border-teal-200 bg-gradient-to-br from-white to-teal-50/30">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Time Commitment</h3>
                <p className="text-lg font-semibold text-teal-600 mb-3">{plan?.weeklyHours || learner?.weeklyHours || 5} hours per week</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shorter weeks get shorter sessions. The schedule is split into focused study blocks.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-5 shadow-lg hover:shadow-xl transition-all border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Learning Pace</h3>
                <p className="text-lg font-semibold text-purple-600 mb-3">{plan?.personalization?.pace || learner?.pace || 'Balanced Approach'}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pace and support mode shape how demanding each task feels.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-5 shadow-lg hover:shadow-xl transition-all border-pink-200 bg-gradient-to-br from-white to-pink-50/30">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Personalization</h3>
                <p className="text-lg font-semibold text-pink-600 mb-3">{(plan?.personalization?.hobbies || learner?.hobbies || []).join(' & ') || 'Personalized Examples'}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {plan?.personalization?.supportMode || learner?.supportMode || 'balanced'} support and your hobbies are stored for explanations.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Schedule */}
        <Card className="p-8 shadow-xl border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Your Optimized Weekly Schedule</h3>
            <Badge className="bg-blue-100 text-blue-700">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Prototype adaptive plan
            </Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {(planItems.length ? planItems : [
              { day: 'Monday', concept: plan?.weakConcept || learner?.diagnosticWeakConcept || 'Review topic', taskTitle: 'Review lesson', estimatedMinutes: learner?.sessionLength || 30, supportLevel: 'guided', reason: 'Fallback session', status: 'upcoming', recommendedResourceType: 'review' },
              { day: 'Wednesday', concept: plan?.subject || learner?.subject || 'Track', taskTitle: 'Practice lesson', estimatedMinutes: learner?.sessionLength || 30, supportLevel: 'balanced', reason: 'Fallback session', status: 'upcoming', recommendedResourceType: 'practice' },
              { day: 'Friday', concept: plan?.goal || learner?.goal || 'Goal', taskTitle: 'Quick self-check', estimatedMinutes: learner?.sessionLength || 30, supportLevel: 'balanced', reason: 'Fallback session', status: 'upcoming', recommendedResourceType: 'quiz' },
            ]).map((session, index) => (
              <div key={`${session.day}-${index}`} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-lg text-gray-900 mb-1">{session.day}</div>
                    <div className="text-sm text-gray-600">{session.concept}</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">
                    {session.estimatedMinutes}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700 font-medium">{session.taskTitle}</span>
                  </div>
                  <p className="text-xs text-gray-600">{session.reason}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Support: {session.supportLevel}</span>
                    <span>{session.recommendedResourceType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6 text-center">
            These sessions are generated from your saved learner profile and diagnostic weak concept.
          </p>
        </Card>

        {/* Why This Plan */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Why This Plan Works For You</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              plan?.rationale?.text || 'This plan starts with the weakest concept from your diagnostic and adjusts the task difficulty to your profile.',
              `Support mode: ${plan?.personalization?.supportMode || learner?.supportMode || 'balanced'}`,
              `Confidence level: ${plan?.personalization?.confidence || learner?.confidence || 50}%`,
              `Hobbies used for examples: ${(plan?.personalization?.hobbies || learner?.hobbies || []).join(', ') || 'not yet provided'}`,
              `Estimated time per session: ${plan?.sessionLength || learner?.sessionLength || 30} minutes`,
              `First lesson opens from the plan using ${plan?.nextLesson?.taskTitle || 'the first recommended activity'}`,
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-blue-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-2 border-indigo-200 shadow-xl bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-900">Free Learning Resources</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600 mb-2">Wikipedia Summary</p>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{plan?.freeResources?.wikipedia?.title || 'Topic overview'}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {plan?.freeResources?.wikipedia?.summary || 'A free summary from Wikipedia will appear here when your plan is generated.'}
              </p>
              {plan?.freeResources?.wikipedia?.url && (
                <a className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline" href={plan.freeResources.wikipedia.url} target="_blank" rel="noreferrer">
                  Open Wikipedia source
                </a>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600 mb-2">Open Library Books</p>
              <div className="space-y-3">
                {(plan?.freeResources?.openLibraryBooks?.length ? plan.freeResources.openLibraryBooks : []).slice(0, 3).map((book, index) => (
                  <div key={`${book.title}-${index}`} className="rounded-xl border border-gray-100 p-3">
                    <div className="font-semibold text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-600">{book.author}</div>
                    {book.url && (
                      <a className="text-sm font-medium text-indigo-600 hover:underline" href={book.url} target="_blank" rel="noreferrer">
                        View book
                      </a>
                    )}
                  </div>
                ))}
                {!plan?.freeResources?.openLibraryBooks?.length && (
                  <p className="text-sm text-gray-500">Book suggestions will appear here when the backend returns results.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* What's Next */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">What Happens Next?</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-gray-900">Access Your Dashboard</p>
                <p className="text-sm text-gray-600">See your personalized learning path and start your first lesson</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-gray-900">Meet Your AI Tutor</p>
                <p className="text-sm text-gray-600">Get instant help with personalized explanations anytime you need</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-gray-900">Track Your Progress</p>
                <p className="text-sm text-gray-600">Watch your skills grow with detailed analytics and insights</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/lesson/1')}
            className="text-lg px-12 py-7 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Open First Lesson
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="text-lg px-12 py-7 rounded-2xl"
          >
            Go to My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
