'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type Utterance = {
  id: string;
  speaker: string;
  content: string;
  startTime?: number;
  endTime?: number;
  orderIndex: number;
};

type Transcript = {
  id: string;
  title: string;
  originalFileName?: string;
  fileType?: string;
  status: string;
  createdAt: string;
};

export default function TranscriptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSpeaker, setEditingSpeaker] = useState('');
  const [selectedUtterances, setSelectedUtterances] = useState<Set<string>>(new Set());
  const router = useRouter();

  const fetchTranscript = async () => {
    try {
      const response = await fetch(`/api/transcripts/${id}`);
      const data = await response.json();
      setTranscript(data.transcript);
      setUtterances(data.utterances || []);
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscript();
  }, [id, fetchTranscript]);

  const handleSpeakerEdit = (utterance: Utterance) => {
    setEditingId(utterance.id);
    setEditingSpeaker(utterance.speaker);
  };

  const handleSpeakerUpdate = async (utteranceId: string, updateType: 'single' | 'forward' | 'all') => {
    try {
      const response = await fetch('/api/utterances/batch-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utteranceId,
          speaker: editingSpeaker,
          updateType,
        }),
      });

      if (response.ok) {
        await fetchTranscript();
        setEditingId(null);
        setEditingSpeaker('');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleMerge = async () => {
    const utteranceIds = Array.from(selectedUtterances);
    if (utteranceIds.length < 2) {
      console.error('Please select at least 2 utterances to merge');
      return;
    }

    try {
      const response = await fetch('/api/utterances/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utteranceIds }),
      });

      if (response.ok) {
        await fetchTranscript();
        setSelectedUtterances(new Set());
      }
    } catch (error) {
      console.error('Merge error:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/transcripts/${id}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${transcript?.title || 'transcript'}.md`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const toggleSelection = (utteranceId: string) => {
    const newSelection = new Set(selectedUtterances);
    if (newSelection.has(utteranceId)) {
      newSelection.delete(utteranceId);
    } else {
      newSelection.add(utteranceId);
    }
    setSelectedUtterances(newSelection);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!transcript) {
    return <div className="text-center py-8">Transcript not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{transcript.title}</h1>
          {transcript.originalFileName && (
            <p className="text-gray-600">
              Source:
              {transcript.originalFileName}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard/transcripts')}>
            Back
          </Button>
          {selectedUtterances.size > 1 && (
            <Button onClick={handleMerge} variant="secondary">
              Merge Selected (
              {selectedUtterances.size}
              )
            </Button>
          )}
          <Button onClick={handleExport} variant="primary">
            Export Markdown
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {utterances.map(utterance => (
          <Card
            key={utterance.id}
            className={`p-4 ${
              selectedUtterances.has(utterance.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedUtterances.has(utterance.id)}
                onChange={() => toggleSelection(utterance.id)}
                className="mt-1"
              />
              <div className="flex-1">
                {editingId === utterance.id
                  ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editingSpeaker}
                          onChange={e => setEditingSpeaker(e.target.value)}
                          className="px-2 py-1 border rounded mr-2"
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSpeakerUpdate(utterance.id, 'single')}
                        >
                          This Only
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSpeakerUpdate(utterance.id, 'forward')}
                          className="ml-1"
                        >
                          This & Forward
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSpeakerUpdate(utterance.id, 'all')}
                          className="ml-1"
                        >
                          All
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingId(null);
                            setEditingSpeaker('');
                          }}
                          className="ml-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    )
                  : (
                      <button
                        type="button"
                        className="font-semibold text-blue-600 cursor-pointer hover:underline mb-2 text-left"
                        onClick={() => handleSpeakerEdit(utterance)}
                      >
                        {utterance.speaker}
                      </button>
                    )}
                <p className="text-gray-800 whitespace-pre-wrap">{utterance.content}</p>
                {(utterance.startTime !== undefined || utterance.endTime !== undefined) && (
                  <p className="text-xs text-gray-500 mt-2">
                    {utterance.startTime !== undefined
                      && `Start: ${(utterance.startTime / 1000).toFixed(1)}s`}
                    {utterance.startTime !== undefined && utterance.endTime !== undefined && ' | '}
                    {utterance.endTime !== undefined
                      && `End: ${(utterance.endTime / 1000).toFixed(1)}s`}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
