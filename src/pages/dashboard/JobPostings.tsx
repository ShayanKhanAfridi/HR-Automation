import { useEffect, useState } from 'react';
import { Plus, Briefcase, Upload, Check, Loader2, Share2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { Job } from '../../types';
import { postAutomationWebhook } from '../../utils/webhook';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read banner image'));
    reader.readAsDataURL(file);
  });

const dataUrlToFile = (dataUrl: string, fileName: string) => {
  const parts = dataUrl.split(',');
  if (parts.length < 2) {
    throw new Error('Invalid image data');
  }

  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(parts[1]);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new File([buffer], fileName, { type: mime });
};

type ShareState = 'idle' | 'loading' | 'shared';

export const JobPostings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [shareOnSocial, setShareOnSocial] = useState(false);
  const [postingStatus, setPostingStatus] = useState<Record<string, ShareState>>({});
  const [creatingJob, setCreatingJob] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setJobs([]);
        setPostingStatus({});
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setJobs(data || []);
      setPostingStatus({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load job postings';
      showToast(message, 'error');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerSocialAutomation = async (jobTitle: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('message', 'job posting');
    formData.append('job_title', jobTitle);
    formData.append('image', imageFile);

    await postAutomationWebhook(formData);
  };

  const handleCreateJob = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!title.trim()) {
      showToast('Please enter a job title', 'error');
      return;
    }

    if (!bannerFile) {
      showToast('Please upload a banner image before posting the job', 'error');
      return;
    }

    const bannerDataUrl = await fileToDataUrl(bannerFile);

    setCreatingJob(true);

    try {
      if (shareOnSocial) {
        await triggerSocialAutomation(title, bannerFile);
      }

      const { error } = await supabase.from('jobs').insert({
        user_id: user.id,
        title,
        banner_image_url: bannerDataUrl,
      });

      if (error) {
        throw new Error(error.message);
      }

      showToast('Job posted successfully!', 'success');
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post job';
      showToast(message, 'error');
    } finally {
      setCreatingJob(false);
    }
  };

  const handleShareJob = async (job: Job) => {
    if (!job.banner_image_url) {
      showToast('Banner image missing. Please edit the job to re-upload an image before sharing.', 'error');
      return;
    }

    setPostingStatus((prev) => ({
      ...prev,
      [job.id]: 'loading',
    }));

    try {
      showToast('Sharing job to LinkedIn & Instagram...', 'info');

      const bannerFileFromData = dataUrlToFile(job.banner_image_url, `${job.title}.png`);
      await triggerSocialAutomation(job.title, bannerFileFromData);

      showToast('Job shared successfully!', 'success');

      setPostingStatus((prev) => ({
        ...prev,
        [job.id]: 'shared',
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post job';
      showToast(message, 'error');

      setPostingStatus((prev) => ({
        ...prev,
        [job.id]: 'idle',
      }));
    }
  };

  const resetForm = () => {
    setTitle('');
    setBannerFile(null);
    setShareOnSocial(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
          <p className="text-gray-600">Create and manage your job postings</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Create Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
            <p className="text-gray-600 mb-6">Create your first job posting to start hiring</p>
            <Button onClick={() => setShowModal(true)}>Create Job</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <Button
                    size="sm"
                    variant={(postingStatus[job.id] ?? 'idle') === 'shared' ? 'secondary' : 'outline'}
                    onClick={() => handleShareJob(job)}
                    disabled={(postingStatus[job.id] ?? 'idle') !== 'idle'}
                    className="gap-2"
                  >
                    {postingStatus[job.id] === 'shared' ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        Shared to LinkedIn & Instagram
                      </>
                    ) : postingStatus[job.id] === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        Share to LinkedIn & Instagram
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Job Posting" size="lg">
        <div className="space-y-4">
          <Input 
            label="Job Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Senior Software Engineer" 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <Upload size={20} />
                <span>Upload Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {bannerFile && (
                <span className="text-sm text-gray-600">{bannerFile.name}</span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Automation</label>
            <button
              type="button"
              onClick={() => setShareOnSocial((prev) => !prev)}
              className={`w-full rounded-xl border p-4 flex items-center gap-4 transition ${
                shareOnSocial ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`p-3 rounded-full bg-white shadow ${shareOnSocial ? 'text-blue-600' : 'text-gray-500'}`}>
                <Share2 size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">LinkedIn + Instagram</p>
                <p className="text-sm text-gray-500">
                  {shareOnSocial ? 'Will auto-share after posting' : 'Share manually later from Posted Jobs'}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  shareOnSocial ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {shareOnSocial ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>
          <Button onClick={handleCreateJob} className="w-full" isLoading={creatingJob} disabled={creatingJob}>
            {creatingJob ? 'Posting Job...' : 'Create Job Posting'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
