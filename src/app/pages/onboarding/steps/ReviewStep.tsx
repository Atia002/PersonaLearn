import { Card } from '../../../components/ui/card';
import { Target, BookOpen, Clock, Zap, Video, Heart, Brain, Edit } from 'lucide-react';
import { getHobbyLabels } from '../../../data/hobbiesData';

interface ReviewStepProps {
  data: any;
  onEdit: (step: number) => void;
}

export default function ReviewStep({ data, onEdit }: ReviewStepProps) {
  const hobbyDisplay = data.hobbies.length > 0 
    ? getHobbyLabels(data.hobbies.slice(0, 3)).join(', ') + (data.hobbies.length > 3 ? `, +${data.hobbies.length - 3} more` : '')
    : 'None selected';

  const sections = [
    { icon: <Target className="w-5 h-5" />, label: 'Goal', value: data.goal, step: 1 },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Subject', value: data.subject, step: 2 },
    { icon: <Clock className="w-5 h-5" />, label: 'Time', value: `${data.weeklyHours}h/week`, step: 3 },
    { icon: <Zap className="w-5 h-5" />, label: 'Pace', value: data.pace, step: 4 },
    { icon: <Video className="w-5 h-5" />, label: 'Path', value: data.pathPreference, step: 5 },
    { icon: <Heart className="w-5 h-5" />, label: 'Hobbies', value: hobbyDisplay, step: 6 },
    { icon: <Brain className="w-5 h-5" />, label: 'Confidence', value: `${data.confidence}%`, step: 7 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-600">Make sure everything looks good before we continue</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        {sections.map((section, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#1e40af]">
                  {section.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500">{section.label}</div>
                  <div className="font-medium capitalize">{section.value}</div>
                </div>
              </div>
              <button
                onClick={() => onEdit(section.step)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-6 text-center space-y-3">
        <p className="font-medium text-gray-900">🎉 Ready to start your personalized journey!</p>
        <p className="text-sm text-gray-600">
          Next, we'll run a quick diagnostic to understand your current knowledge level.
          This helps us create the perfect starting point for you.
        </p>
      </div>
    </div>
  );
}