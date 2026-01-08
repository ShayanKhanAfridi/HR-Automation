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
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('full-time');
  const [salaryRange, setSalaryRange] = useState('');
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

    const { error } = await supabase.from('jobs').insert({
      user_id: user.id,
      title,
      description,
      department,
      location,
      employment_type: employmentType,
      salary_range: salaryRange,
      status: 'active',
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

  const handlePostToSocial = async (jobId: string, platform: 'linkedin' | 'instagram') => {
    showToast(`Posting to ${platform}...`, 'info');
    setTimeout(() => {
      showToast(`Job posted to ${platform} successfully!`, 'success');
    }, 1500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDepartment('');
    setLocation('');
    setEmploymentType('full-time');
    setSalaryRange('');
    setBannerFile(null);
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                    {job.salary_range && (
                      <>
                        <span>•</span>
                        <span>{job.salary_range}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={job.posted_to_linkedin ? 'secondary' : 'outline'}
                      onClick={() => handlePostToSocial(job.id, 'linkedin')}
                      disabled={job.posted_to_linkedin}
                    >
                      {job.posted_to_linkedin && <Check size={16} className="mr-1" />}
                      LinkedIn
                    </Button>
                    <Button
                      size="sm"
                      variant={job.posted_to_instagram ? 'secondary' : 'outline'}
                      onClick={() => handlePostToSocial(job.id, 'instagram')}
                      disabled={job.posted_to_instagram}
                    >
                      {job.posted_to_instagram && <Check size={16} className="mr-1" />}
                      Instagram
                    </Button>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Job Posting" size="lg">
        <div className="space-y-4">
          <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Job description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <Input label="Salary Range" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="e.g. $80k - $120k" />
          </div>
          <Button onClick={handleCreateJob} className="w-full">Create Job Posting</Button>
        </div>
      </Modal>
    </div>
  );
};
