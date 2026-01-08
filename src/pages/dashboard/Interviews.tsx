import { useEffect, useState } from 'react';
import { Bot, Eye } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { supabase } from '../../lib/supabase';

interface InterviewWithCandidate {
  id: string;
  status: string;
  scheduled_at: string | null;
  transcript: string;
  score: number;
  candidate: {
    name: string;
    email: string;
  };
}

export const Interviews = () => {
  const [interviews, setInterviews] = useState<InterviewWithCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<InterviewWithCandidate | null>(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: interviewData } = await supabase
      .from('interviews')
      .select('id, status, scheduled_at, transcript, score, candidate_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (interviewData) {
      const interviewsWithCandidates = await Promise.all(
        interviewData.map(async (interview) => {
          const { data: candidate } = await supabase
            .from('candidates')
            .select('name, email')
            .eq('id', interview.candidate_id)
            .single();

          return {
            ...interview,
            candidate: candidate || { name: 'Unknown', email: '' },
          };
        })
      );
      setInterviews(interviewsWithCandidates);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Interviews</h1>
        <p className="text-gray-600">Review AI-conducted interviews and transcripts</p>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600">Interviews will appear here once scheduled</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{interview.candidate.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{interview.candidate.email}</p>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      interview.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {interview.status}
                    </span>
                    {interview.score > 0 && (
                      <span className="text-sm text-gray-600">Score: {interview.score}/100</span>
                    )}
                    {interview.scheduled_at && (
                      <span className="text-sm text-gray-600">
                        {new Date(interview.scheduled_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {interview.status === 'completed' && interview.transcript && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowTranscriptModal(true);
                    }}
                  >
                    <Eye size={16} className="mr-2" />
                    View Transcript
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
        title="Interview Transcript"
        size="xl"
      >
        {selectedInterview && (
          <div className="space-y-4">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{selectedInterview.candidate.name}</h3>
              <p className="text-gray-600">{selectedInterview.candidate.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-2xl font-bold text-blue-600">{selectedInterview.score}/100</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedInterview.transcript || 'No transcript available'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
