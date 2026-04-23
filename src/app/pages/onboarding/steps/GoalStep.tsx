import { Textarea } from '../../../components/ui/textarea';
import { Card } from '../../../components/ui/card';
import { Target, Trophy, TrendingUp, Briefcase, Heart, Plus } from 'lucide-react';

interface GoalStepProps {
  data: { goal: string; reason: string };
  updateData: (data: any) => void;
}

const goalOptions = [
  { id: 'exam', label: 'Exam Preparation', icon: <Trophy className="w-5 h-5" /> },
  { id: 'project', label: 'Build a Project', icon: <Target className="w-5 h-5" /> },
  { id: 'grades', label: 'Improve Grades', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'career', label: 'Career Development', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'interest', label: 'Personal Interest', icon: <Heart className="w-5 h-5" /> },
  { id: 'other', label: 'Other', icon: <Plus className="w-5 h-5" /> }
];

export default function GoalStep({ data, updateData }: GoalStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">What's your learning goal?</h2>
        <p className="text-gray-600">This helps us understand what you want to achieve</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
        {goalOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              data.goal === option.id
                ? 'border-2 border-[#1e40af] bg-blue-50'
                : 'border-2 border-transparent'
            }`}
            onClick={() => updateData({ goal: option.id })}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                data.goal === option.id ? 'bg-[#1e40af] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium">Tell us more about your goal (optional)</label>
        <Textarea
          placeholder="E.g., I have a JavaScript exam in 4 weeks and need to understand functions and objects..."
          value={data.reason}
          onChange={(e) => updateData({ reason: e.target.value })}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
}
