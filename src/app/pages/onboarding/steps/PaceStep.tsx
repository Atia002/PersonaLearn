import { Card } from '../../../components/ui/card';
import { Turtle, Gauge, Zap, BookOpen, Flame } from 'lucide-react';

interface PaceStepProps {
  data: { pace: string };
  updateData: (data: any) => void;
}

const paces = [
  { id: 'slow', label: 'Slow & Guided', icon: <Turtle className="w-6 h-6" />, desc: 'Take your time, deep understanding first', color: 'from-blue-400 to-blue-500' },
  { id: 'balanced', label: 'Balanced', icon: <Gauge className="w-6 h-6" />, desc: 'Steady progress with good depth', color: 'from-teal-400 to-teal-500' },
  { id: 'fast', label: 'Fast', icon: <Zap className="w-6 h-6" />, desc: 'Fast-paced, cover more ground quickly', color: 'from-purple-400 to-purple-500' }
];

export default function PaceStep({ data, updateData }: PaceStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">What's your preferred pace?</h2>
        <p className="text-gray-600">We'll adjust content density and progression speed</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-4">
        {paces.map((pace) => (
          <Card
            key={pace.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              data.pace === pace.id
                ? 'border-2 border-[#1e40af] shadow-lg'
                : 'border-2 border-transparent'
            }`}
            onClick={() => updateData({ pace: pace.id })}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pace.color} flex items-center justify-center text-white`}>
                {pace.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{pace.label}</h3>
                <p className="text-sm text-gray-600">{pace.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
