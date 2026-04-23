import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="atia@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <Button>Update Account</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Email notifications for upcoming sessions', defaultChecked: true },
              { label: 'Weekly progress summaries', defaultChecked: true },
              { label: 'AI tutor recommendations', defaultChecked: true },
              { label: 'New content alerts', defaultChecked: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <Switch defaultChecked={item.defaultChecked} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">AI Tutor Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Use only uploaded materials for answers</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Include external sources</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-save chat history</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </Card>
      </div>
    </div>
  );
}
