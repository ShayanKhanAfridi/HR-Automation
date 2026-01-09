import { useEffect, useState } from 'react';
import { Plus, Briefcase, Upload, Check } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';
import { Job } from '../../types';

export const JobPostings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postToLinkedIn, setPostToLinkedIn] = useState(false);
  const [postToInstagram, setPostToInstagram] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setJobs(data || []);
    setLoading(false);
  };

  const handleCreateJob = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!title.trim()) {
      showToast('Please enter a job title', 'error');
      return;
    }

    const { error } = await supabase.from('jobs').insert({
      user_id: user.id,
      title,
      description,
      banner_image_url: null,
      posted_to_linkedin: postToLinkedIn,
      posted_to_instagram: postToInstagram,
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Job posted successfully!', 'success');
      setShowModal(false);
      resetForm();
      fetchJobs();
    }
  };

  const handlePostToSocial = async (platform: 'linkedin' | 'instagram') => {
    showToast(`Posting to ${platform}...`, 'info');
    setTimeout(() => {
      showToast(`Job posted to ${platform} successfully!`, 'success');
    }, 1500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBannerFile(null);
    setPostToLinkedIn(false);
    setPostToInstagram(false);
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
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={job.posted_to_linkedin ? 'secondary' : 'outline'}
                      onClick={() => handlePostToSocial('linkedin')}
                      disabled={job.posted_to_linkedin}
                    >
                      {job.posted_to_linkedin && <Check size={16} className="mr-1" />}
                      LinkedIn
                    </Button>
                    <Button
                      size="sm"
                      variant={job.posted_to_instagram ? 'secondary' : 'outline'}
                      onClick={() => handlePostToSocial('instagram')}
                      disabled={job.posted_to_instagram}
                    >
                      {job.posted_to_instagram && <Check size={16} className="mr-1" />}
                      Instagram
                    </Button>
                  </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Enter job description, requirements, responsibilities..."
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Post to Social Media</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postToLinkedIn}
                  onChange={(e) => setPostToLinkedIn(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Post to LinkedIn</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postToInstagram}
                  onChange={(e) => setPostToInstagram(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Post to Instagram</span>
              </label>
            </div>
          </div>
          <Button onClick={handleCreateJob} className="w-full">Create Job Posting</Button>
        </div>
      </Modal>
    </div>
  );
};
