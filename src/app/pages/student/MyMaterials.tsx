import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function MyMaterials() {
  const [files] = useState([
    { name: 'JavaScript Lecture Notes.pdf', status: 'ready', date: '3 days ago', topic: 'Functions' },
    { name: 'Quiz 1 Solutions.pdf', status: 'processing', date: '1 day ago', topic: 'Variables' },
    { name: 'Chapter 3 Slides.pdf', status: 'ready', date: '1 week ago', topic: 'Loops' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Materials</h1>
          <p className="text-gray-600">Upload your class notes and materials for personalized AI tutoring</p>
        </div>

        <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-[#1e40af]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Drop files here or click to upload</h3>
              <p className="text-sm text-gray-600">PDF, DOCX, TXT, or images up to 10MB</p>
            </div>
            <Button>Choose Files</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="font-semibold">Uploaded Materials</h2>
          {files.map((file, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#1e40af]" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{file.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[#1e40af] rounded">
                        {file.topic}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {file.status === 'ready' ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ready</span>
                      </div>
                      <Button size="sm">Ask AI</Button>
                      <Button size="sm" variant="outline">Generate Quiz</Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
