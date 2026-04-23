import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Sparkles, Target, Brain, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-sm font-medium text-[#1e40af]">
          <Sparkles className="w-4 h-4" />
          Welcome to PersonaLearn
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Let's personalize your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-[#14b8a6]">
            learning journey
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          In the next few steps, we'll learn about your goals, pace, interests, and preferences 
          to create a learning path designed just for you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 py-8">
        <Card className="p-6 text-left">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-[#1e40af]" />
          </div>
          <h3 className="font-semibold mb-2">Tailored to Your Goals</h3>
          <p className="text-sm text-gray-600">
            Whether you're preparing for exams or learning for fun, we adapt to your needs
          </p>
        </Card>

        <Card className="p-6 text-left">
          <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#14b8a6]" />
          </div>
          <h3 className="font-semibold mb-2">Your Interests Matter</h3>
          <p className="text-sm text-gray-600">
            Learn through examples from gaming, music, sports, or whatever you love
          </p>
        </Card>

        <Card className="p-6 text-left">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h3 className="font-semibold mb-2">Adaptive Progress</h3>
          <p className="text-sm text-gray-600">
            Your path evolves based on your performance and changing needs
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">This will take about 5 minutes</p>
        <Button size="lg" onClick={onNext} className="px-12">
          Start Personalizing
        </Button>
      </div>
    </div>
  );
}
