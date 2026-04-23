import { Card } from '../../../components/ui/card';
import { Slider } from '../../../components/ui/slider';
import { GraduationCap, User, Sparkles } from 'lucide-react';

interface ConfidenceStepProps {
  data: { confidence: number; explanationLevel: string; supportMode: string };
  updateData: (data: any) => void;
}

const explanationLevels = [
  { id: 'beginner', label: 'Beginner', desc: 'Explain like I\'m new to this', icon: <User className="w-5 h-5" /> },
  { id: 'normal', label: 'Normal', desc: 'Standard explanations', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'advanced', label: 'Advanced', desc: 'I have some background', icon: <Sparkles className="w-5 h-5" /> }
];

const supportModes = [
  { id: 'guided', label: 'Guided', desc: 'More hand-holding and hints' },
  { id: 'balanced', label: 'Balanced', desc: 'Support when needed' },
  { id: 'independent', label: 'Independent', desc: 'Let me figure things out' }
];

export default function ConfidenceStep({ data, updateData }: ConfidenceStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">How confident are you?</h2>
        <p className="text-gray-600">We'll adjust our teaching style to match your needs</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Confidence Level: {data.confidence}%</label>
        <Slider
          value={[data.confidence]}
          onValueChange={(value) => updateData({ confidence: value[0] })}
          min={0}
          max={100}
          step={10}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Just Starting</span>
          <span>Somewhat Familiar</span>
          <span>Very Confident</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Explanation Level</label>
        <div className="grid grid-cols-3 gap-4">
          {explanationLevels.map((level) => (
            <Card
              key={level.id}
              className={`p-4 cursor-pointer transition-all ${
                data.explanationLevel === level.id
                  ? 'border-2 border-[#1e40af] bg-blue-50'
                  : 'border-2 border-transparent'
              }`}
              onClick={() => updateData({ explanationLevel: level.id })}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  data.explanationLevel === level.id ? 'bg-[#1e40af] text-white' : 'bg-gray-100'
                }`}>
                  {level.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{level.label}</div>
                  <div className="text-xs text-gray-600">{level.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Support Mode</label>
        <div className="grid grid-cols-3 gap-4">
          {supportModes.map((mode) => (
            <Card
              key={mode.id}
              className={`p-4 cursor-pointer transition-all ${
                data.supportMode === mode.id
                  ? 'border-2 border-[#1e40af] bg-blue-50'
                  : 'border-2 border-transparent'
              }`}
              onClick={() => updateData({ supportMode: mode.id })}
            >
              <div className="text-center">
                <div className="font-medium text-sm mb-1">{mode.label}</div>
                <div className="text-xs text-gray-600">{mode.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
