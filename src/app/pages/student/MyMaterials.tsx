import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { FileText, BookOpen, Save, Loader2, Sparkles, NotebookPen } from 'lucide-react';
import { useLearner } from '../../contexts/LearnerContext';
import { listMaterials, saveMaterial, type MaterialRecord } from '../../utils/learnerApi';

const subjectConcepts: Record<string, string[]> = {
  programming: ['Variables', 'Conditionals', 'Loops', 'Functions'],
  writing: ['Thesis Statement', 'Paragraph Structure', 'Grammar Clarity', 'Referencing'],
  science: ['Scientific Method', 'Matter and Energy', 'Forces and Motion', 'Basic Biology'],
};

const subjectLabels: Record<string, string> = {
  programming: 'Programming',
  writing: 'Academic Writing',
  science: 'Science',
};

export default function MyMaterials() {
  const { learner, updateLearner } = useLearner();
  const [selectedSubject, setSelectedSubject] = useState(learner?.subject || 'programming');
  const [concept, setConcept] = useState('');
  const [title, setTitle] = useState('');
  const [notesText, setNotesText] = useState('');
  const [usableByTutor, setUsableByTutor] = useState(true);
  const [materials, setMaterials] = useState<MaterialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const conceptOptions = useMemo(() => subjectConcepts[selectedSubject] || [], [selectedSubject]);

  useEffect(() => {
    if (!concept && conceptOptions.length > 0) {
      setConcept(conceptOptions[0]);
    }
  }, [concept, conceptOptions]);

  useEffect(() => {
    const loadMaterials = async () => {
      if (!learner?.id) {
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await listMaterials(learner.id);
        setMaterials(response.materials || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load your notes.');
      } finally {
        setLoading(false);
      }
    };

    void loadMaterials();
  }, [learner?.id]);

  const refreshMaterials = async () => {
    if (!learner?.id) {
      return;
    }

    const response = await listMaterials(learner.id);
    setMaterials(response.materials || []);
  };

  const handleSave = async () => {
    if (!learner?.id || notesText.trim() === '') {
      setError('Paste some notes before saving.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await saveMaterial({
        userId: learner.id,
        subject: selectedSubject,
        concept,
        title: title.trim(),
        notesText: notesText.trim(),
        usableByTutor,
      });

      updateLearner({
        materialsCount: (learner.materialsCount || 0) + 1,
      });

      setMaterials((current) => [response.material, ...current]);
      setTitle('');
      setNotesText('');
      setUsableByTutor(true);
      if (conceptOptions.length > 0) {
        setConcept(conceptOptions[0]);
      }
      void refreshMaterials();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save notes.');
    } finally {
      setSaving(false);
    }
  };

  if (!learner?.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">My Materials</h1>
            <p className="text-gray-600">Sign in to save class notes for your tutor.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/20 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Materials</h1>
            <p className="text-gray-600">Paste your class notes here and make them available to the tutor.</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 px-3 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {materials.length} saved notes
          </Badge>
        </div>

        <Card className="p-6 shadow-lg border-blue-200 bg-white/90">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(event) => {
                    const nextSubject = event.target.value;
                    setSelectedSubject(nextSubject);
                    const nextConcepts = subjectConcepts[nextSubject] || [];
                    setConcept(nextConcepts[0] || '');
                  }}
                  className="mt-2 h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm"
                >
                  {Object.entries(subjectLabels).map(([subjectId, label]) => (
                    <option key={subjectId} value={subjectId}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="concept">Concept</Label>
                <Input
                  id="concept"
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  placeholder="Type or choose a concept"
                  className="mt-2 h-11 rounded-xl"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {conceptOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setConcept(option)}
                      className={`rounded-full px-3 py-1 text-xs border transition-colors ${concept === option ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Note title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Week 4 lecture summary"
                  className="mt-2 h-11 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">Usable by tutor</p>
                  <p className="text-sm text-gray-500">Allow the tutor to use these notes in explanations.</p>
                </div>
                <Switch checked={usableByTutor} onCheckedChange={setUsableByTutor} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Paste notes</Label>
                <Textarea
                  id="notes"
                  value={notesText}
                  onChange={(event) => setNotesText(event.target.value)}
                  placeholder="Paste your class notes, lecture summary, or study sheet here..."
                  className="mt-2 min-h-[280px] rounded-2xl"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Notes
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <NotebookPen className="w-4 h-4" />
                  Stored in backend JSON storage
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          Saved notes for {subjectLabels[selectedSubject]} will be available to the lesson tutor.
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Notes</h2>
            {loading && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading notes
              </span>
            )}
          </div>

          {materials.length === 0 && !loading ? (
            <Card className="p-8 text-center border-dashed border-gray-300">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold mb-1">No saved notes yet</h3>
              <p className="text-sm text-gray-500">Paste a note above to make it available to the tutor.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {materials.map((material) => (
                <Card key={material.id} className="p-5 shadow-sm hover:shadow-md transition-shadow border-gray-200">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{material.title}</h3>
                      <p className="text-xs text-gray-500">{subjectLabels[material.subject] || material.subject} • {material.concept || 'No concept set'}</p>
                    </div>
                    <Badge className={material.usableByTutor ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                      {material.usableByTutor ? 'Tutor-ready' : 'Private'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-4">{material.notesText}</p>
                  <div className="mt-4 text-xs text-gray-500">Saved {material.createdAt}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
