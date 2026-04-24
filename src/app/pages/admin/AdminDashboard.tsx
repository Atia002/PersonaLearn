import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, BookOpen, FileText, Settings, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
    { label: 'Subjects', value: '12', icon: <BookOpen className="w-5 h-5" />, color: 'from-teal-500 to-teal-600' },
    { label: 'Concepts', value: '456', icon: <FileText className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
    { label: 'Questions', value: '2,890', icon: <Settings className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
  ];

  const subjects = [
    { name: 'Programming', modules: 8, concepts: 120, students: 450 },
    { name: 'Academic Writing', modules: 6, concepts: 85, students: 320 },
    { name: 'Science', modules: 7, concepts: 98, students: 280 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage content, users, and platform settings</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Content
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Subject Management</h3>
            <Button variant="outline">Add Subject</Button>
          </div>

          <div className="space-y-3">
            {subjects.map((subject, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#1e40af]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{subject.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{subject.modules} modules</span>
                        <span>•</span>
                        <span>{subject.concepts} concepts</span>
                        <span>•</span>
                        <span>{subject.students} students</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Manage Content</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Add Module
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Question Bank
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New user registered', time: '2 min ago' },
                { action: 'Subject "Programming" updated', time: '1 hour ago' },
                { action: 'Quiz questions added', time: '3 hours ago' },
                { action: 'Module content published', time: '1 day ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
