import { useEffect, useState } from 'react';
import { Users, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { supabase } from '../../lib/supabase';
import { Candidate } from '../../types';

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(candidates.filter(c => c.status === selectedStatus));
    }
  }, [selectedStatus, candidates]);

  const fetchCandidates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setCandidates(data || []);
    setFilteredCandidates(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700';
      case 'keep_in_view': return 'bg-orange-100 text-orange-700';
      case 'shortlisted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">Manage and review your candidate pipeline</p>
        </div>
      </div>

      <Card padding="sm">
        <div className="flex items-center gap-4 p-4">
          <Filter size={20} className="text-gray-600" />
          <div className="flex gap-2 flex-wrap">
            {['all', 'applied', 'keep_in_view', 'shortlisted', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filteredCandidates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Candidates will appear here once they apply to your jobs</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} padding="md" hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                      {getStatusLabel(candidate.status)}
                    </span>
                    {candidate.score > 0 && (
                      <span className="text-sm text-gray-600">Score: {candidate.score}/100</span>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => {
                  setSelectedCandidate(candidate);
                  setShowDetailsModal(true);
                }}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Candidate Details"
        size="lg"
      >
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                {selectedCandidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                <p className="text-gray-600">{selectedCandidate.email}</p>
                {selectedCandidate.phone && <p className="text-gray-600">{selectedCandidate.phone}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCandidate.status)}`}>
                {getStatusLabel(selectedCandidate.status)}
              </span>
            </div>
            {selectedCandidate.score > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Screening Score</label>
                <p className="text-2xl font-bold text-blue-600">{selectedCandidate.score}/100</p>
              </div>
            )}
            {selectedCandidate.ai_screening_notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Screening Notes</label>
                <p className="text-gray-600">{selectedCandidate.ai_screening_notes}</p>
              </div>
            )}
            {selectedCandidate.cover_letter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <p className="text-gray-600">{selectedCandidate.cover_letter}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
