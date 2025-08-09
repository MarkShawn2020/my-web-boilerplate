'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type Transcript = {
  id: string;
  title: string;
  originalFileName?: string;
  fileType?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('/api/transcripts');
      const data = await response.json();
      setTranscripts(data.transcripts || []);
    } catch (error) {
      console.error('Failed to fetch transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const response = await fetch('/api/transcripts/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchTranscripts();
      } else {
        const error = await response.json();
        console.error(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure you want to delete this transcript?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transcripts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTranscripts();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Transcripts</h1>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".txt,.md,.docx,.pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button
              disabled={uploading}
              className="cursor-pointer"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </label>
        </div>
      </div>

      {transcripts.length === 0
        ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">No transcripts yet</p>
              <p className="text-sm text-gray-500">Upload a file to get started</p>
            </Card>
          )
        : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transcripts.map(transcript => (
                <button
                  key={transcript.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-lg border border-gray-200 text-left w-full"
                  onClick={() => router.push(`/dashboard/transcripts/${transcript.id}`)}
                  type="button"
                >
                  <h3 className="font-semibold text-lg mb-2 truncate">
                    {transcript.title}
                  </h3>
                  {transcript.originalFileName && (
                    <p className="text-sm text-gray-600 mb-1">
                      File:
                      {' '}
                      {transcript.originalFileName}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mb-2">
                    Type:
                    {' '}
                    {transcript.fileType?.toUpperCase() || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created:
                    {' '}
                    {new Date(transcript.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        transcript.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transcript.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transcript.status}
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(transcript.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          )}
    </div>
  );
}
