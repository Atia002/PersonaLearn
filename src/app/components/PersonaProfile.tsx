import { Target, Clock, Zap, Heart, BookOpen } from 'lucide-react';
import { useLearner } from '../contexts/LearnerContext';
import { subjectData } from '../data/subjectData';
import { getHobbyLabels } from '../data/hobbiesData';

interface ProfileChip {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

interface PersonaProfileProps {
  variant?: 'compact' | 'full';
}

export default function PersonaProfile({ variant = 'compact' }: PersonaProfileProps) {
  const { learner } = useLearner();

  if (!learner) return null;

  const subjectName = learner.subject && subjectData[learner.subject] 
    ? subjectData[learner.subject].name 
    : 'Not selected';

  const chips: ProfileChip[] = [
    { 
      icon: <Target className="w-4 h-4" />, 
      label: 'Goal', 
      value: learner.goal || 'Not set',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      icon: <BookOpen className="w-4 h-4" />, 
      label: 'Subject', 
      value: subjectName,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      icon: <Zap className="w-4 h-4" />, 
      label: 'Pace', 
      value: learner.pace ? learner.pace.charAt(0).toUpperCase() + learner.pace.slice(1) : 'Not set',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    { 
      icon: <Clock className="w-4 h-4" />, 
      label: 'Time', 
      value: `${learner.weeklyHours || 0}h/week`,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    { 
      icon: <Heart className="w-4 h-4" />, 
      label: 'Hobbies', 
      value: learner.hobbies && learner.hobbies.length > 0 
        ? getHobbyLabels(learner.hobbies).slice(0, 2).join(', ')
        : 'Not set',
      color: 'bg-pink-50 text-pink-700 border-pink-200'
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${chip.color} transition-all hover:scale-105`}
          >
            {chip.icon}
            <span>{chip.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {chips.map((chip, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl border ${chip.color} transition-all hover:scale-105`}
        >
          <div className="flex items-center gap-2 mb-1">
            {chip.icon}
            <span className="text-xs font-medium opacity-75">{chip.label}</span>
          </div>
          <div className="text-sm font-semibold">{chip.value}</div>
        </div>
      ))}
    </div>
  );
}