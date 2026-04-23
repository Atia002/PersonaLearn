import { Card } from '../../../components/ui/card';
import { Slider } from '../../../components/ui/slider';
import { Sun, Sunset, Moon } from 'lucide-react';

interface TimeStepProps {
  data: { weeklyHours: number; studyDays: string[]; sessionLength: number; studyTime: string };
  updateData: (data: any) => void;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = [
  { id: 'morning', label: 'Morning', icon: <Sun className="w-5 h-5" />, desc: '6am - 12pm' },
  { id: 'afternoon', label: 'Afternoon', icon: <Sunset className="w-5 h-5" />, desc: '12pm - 6pm' },
  { id: 'night', label: 'Night', icon: <Moon className="w-5 h-5" />, desc: '6pm - 12am' }
];

export default function TimeStep({ data, updateData }: TimeStepProps) {
  const toggleDay = (day: string) => {
    const newDays = data.studyDays.includes(day)
      ? data.studyDays.filter(d => d !== day)
      : [...data.studyDays, day];
    updateData({ studyDays: newDays });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">When can you study?</h2>
        <p className="text-gray-600">Help us create a realistic schedule</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Weekly Study Hours: {data.weeklyHours} hours</label>
        <Slider
          value={[data.weeklyHours]}
          onValueChange={(value) => updateData({ weeklyHours: value[0] })}
          min={1}
          max={40}
          step={1}
          className="py-4"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Preferred Study Days</label>
        <div className="flex gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                data.studyDays.includes(day)
                  ? 'border-[#1e40af] bg-blue-50 text-[#1e40af]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Session Length: {data.sessionLength} minutes</label>
        <Slider
          value={[data.sessionLength]}
          onValueChange={(value) => updateData({ sessionLength: value[0] })}
          min={15}
          max={120}
          step={15}
          className="py-4"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Best Study Time</label>
        <div className="grid grid-cols-3 gap-4">
          {times.map((time) => (
            <Card
              key={time.id}
              className={`p-4 cursor-pointer transition-all ${
                data.studyTime === time.id
                  ? 'border-2 border-[#1e40af] bg-blue-50'
                  : 'border-2 border-transparent'
              }`}
              onClick={() => updateData({ studyTime: time.id })}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  data.studyTime === time.id ? 'bg-[#1e40af] text-white' : 'bg-gray-100'
                }`}>
                  {time.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{time.label}</div>
                  <div className="text-xs text-gray-500">{time.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
