import { useEffect, useMemo, useState } from 'react';
import { Users, Mail, Phone, FileText, MessageSquare, Award, AlertTriangle, Sparkles, RefreshCw, Play } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { ResumeScreeningResult } from '../../types';

export const Candidates = () => {
  const [screeningResults, setScreeningResults] = useState<ResumeScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activatingWorkflow, setActivatingWorkflow] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCandidatesData();
  }, []);

  const fetchCandidatesData = async (options?: { background?: boolean; skipRefreshState?: boolean }) => {
    const background = options?.background;
    const skipRefreshState = options?.skipRefreshState;

    if (background) {
      if (!skipRefreshState) {
        setIsRefreshing(true);
      }
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase.from('resume_screening_results').select('*');

      if (error) {
        setScreeningResults([]);
        setErrorMessage(error.message);
      } else {
        const sorted = (data || []).sort((a, b) => (b.overall_score ?? 0) - (a.overall_score ?? 0));
        setScreeningResults(sorted);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Failed to fetch candidate data:', error);
      setScreeningResults([]);
      setErrorMessage('Unable to load candidates. Please try again later.');
    } finally {
      if (background) {
        if (!skipRefreshState) {
          setIsRefreshing(false);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const postResumeScreeningWebhook = async () => {
    const response = await fetch('https://tabby180756.app.n8n.cloud/webhook/56ecccdc-3c7f-44d6-9ce4-125aa62f8856', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'resume screening activated' }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to trigger resume screening');
    }
  };

  const triggerResumeScreening = async () => {
    if (activatingWorkflow) return;

    setActivatingWorkflow(true);
    try {
      await postResumeScreeningWebhook();
      showToast('Resume screening triggered successfully!', 'success');
      fetchCandidatesData({ background: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to trigger resume screening';
      showToast(message, 'error');
    } finally {
      setActivatingWorkflow(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await postResumeScreeningWebhook();
      showToast('Resume screening refreshed successfully!', 'success');
      await fetchCandidatesData({ background: true, skipRefreshState: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh candidates';
      showToast(message, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDecisionBadge = (decision?: string | null) => {
    switch ((decision || '').toLowerCase()) {
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'kiv':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDecisionLabel = (decision?: string | null) => {
    if (!decision) return 'Pending Review';
    return decision.charAt(0).toUpperCase() + decision.slice(1).toLowerCase();
  };

  const decisionStats = useMemo(() => {
    return screeningResults.reduce(
      (acc, result) => {
        const key = (result.decision || 'pending').toLowerCase() as 'shortlisted' | 'kiv' | 'rejected' | 'pending';
        if (key in acc) {
          acc[key as keyof typeof acc] += 1;
        } else {
          acc.pending += 1;
        }
        return acc;
      },
      { shortlisted: 0, kiv: 0, rejected: 0, pending: 0 }
    );
  }, [screeningResults]);

  const averageScore = useMemo(() => {
    if (screeningResults.length === 0) {
      return 0;
    }
    const total = screeningResults.reduce((sum, result) => sum + (result.overall_score ?? 0), 0);
    return Math.round(total / screeningResults.length);
  }, [screeningResults]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">AI-screened applicants from the resume pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={triggerResumeScreening}
            disabled={activatingWorkflow}
            className="gap-2"
          >
            <Play size={16} className={activatingWorkflow ? 'animate-pulse' : ''} />
            {activatingWorkflow ? 'Activating...' : 'Resume Screening'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing' : 'Refresh'}
          </Button>
        </div>
      </div>

      {screeningResults.length > 0 && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Reviewed</p>
              <p className="text-3xl font-bold text-gray-900">{screeningResults.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
              <p className="text-3xl font-bold text-blue-600">{averageScore}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-green-600">{decisionStats.shortlisted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{decisionStats.pending}</p>
            </div>
          </div>
        </Card>
      )}

      {errorMessage ? (
        <Card>
          <div className="text-center py-12 text-red-600">
            {errorMessage}
          </div>
        </Card>
      ) : screeningResults.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No AI-screened candidates yet</h3>
            <p className="text-gray-600">Upload resumes to populate this list.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {screeningResults.map((candidate) => (
            <Card key={candidate.id} padding="md" hover>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                      {(candidate.full_name || 'N/A').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name || 'Unnamed Applicant'}</h3>
                      <div className="flex flex-col text-sm text-gray-600">
                        {candidate.email && (
                          <span className="flex items-center gap-2">
                            <Mail size={14} /> {candidate.email}
                          </span>
                        )}
                        {candidate.phone_number && (
                          <span className="flex items-center gap-2">
                            <Phone size={14} /> {candidate.phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDecisionBadge(candidate.decision)}`}>
                      {formatDecisionLabel(candidate.decision)}
                    </span>
                    {candidate.status && (
                      <span className="text-xs uppercase tracking-wide text-gray-500">{candidate.status}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                    <Award size={16} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Overall Score</p>
                      <p className="text-base font-semibold text-gray-900">{candidate.overall_score ?? 0}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                    <FileText size={16} className="text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Skills</p>
                      <p className="text-base font-semibold text-gray-900">{candidate.skills_score ?? 0}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Experience</p>
                      <p className="text-base font-semibold text-gray-900">{candidate.experience_score ?? 0}%</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidate.applicant_skill && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Sparkles size={16} className="text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Highlighted Skills</p>
                        <p>{candidate.applicant_skill}</p>
                      </div>
                    </div>
                  )}
                  {candidate.reason_summary && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MessageSquare size={16} className="text-purple-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">AI Verdict</p>
                        <p>{candidate.reason_summary}</p>
                      </div>
                    </div>
                  )}
                </div>

                {(candidate.resume_drive_url || candidate.resume_drive_file_id) && (
                  <div className="flex items-center gap-4 text-sm">
                    {candidate.resume_drive_url && (
                      <a
                        href={candidate.resume_drive_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium"
                      >
                        <FileText size={16} />
                        View Resume
                      </a>
                    )}
                    {candidate.resume_drive_file_id && (
                      <span className="text-gray-500 text-xs">
                        Drive File ID: {candidate.resume_drive_file_id}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
