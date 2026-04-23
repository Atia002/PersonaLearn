import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, TrendingDown, AlertCircle, BookOpen, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InstructorDashboard() {
  const weakTopics = [
    { topic: 'Loops', students: 12, avgScore: 45 },
    { topic: 'Async/Await', students: 8, avgScore: 38 },
    { topic: 'Array Methods', students: 15, avgScore: 52 },
  ];

  const studentProgress = [
    { week: 'Week 1', avgMastery: 35 },
    { week: 'Week 2', avgMastery: 48 },
    { week: 'Week 3', avgMastery: 62 },
    { week: 'Week 4', avgMastery: 70 },
  ];

  const atRiskStudents = [
    { name: 'John Doe', mastery: 25, lastActive: '5 days ago' },
    { name: 'Jane Smith', mastery: 32, lastActive: '3 days ago' },
    { name: 'Mike Johnson', mastery: 28, lastActive: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Monitor student progress and identify areas for intervention</p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Students', value: '45', icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
            { label: 'Avg Mastery', value: '67%', icon: <BarChart3 className="w-5 h-5" />, color: 'from-teal-500 to-teal-600' },
            { label: 'At Risk', value: '8', icon: <AlertCircle className="w-5 h-5" />, color: 'from-red-500 to-red-600' },
            { label: 'Engagement', value: '92%', icon: <TrendingDown className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Class Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={studentProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgMastery" stroke="#1e40af" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Common Weak Topics</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weakTopics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">At-Risk Students</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {atRiskStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.mastery}% mastery • Last active {student.lastActive}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Profile</Button>
                  <Button size="sm">Contact</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
