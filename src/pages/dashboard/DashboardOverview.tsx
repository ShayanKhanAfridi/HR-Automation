import { useEffect, useState } from 'react';
import { Briefcase, Users, Bot, UserCheck } from 'lucide-react';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalInterviews: 0,
    totalEmployees: 0,
  });

  const [candidatesByStage, setCandidatesByStage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [jobsResult, candidatesResult, interviewsResult, employeesResult, stageResult] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('candidates').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('interviews').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('employees').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('candidates').select('status').eq('user_id', user.id),
      ]);

      setStats({
        totalJobs: jobsResult.count || 0,
        totalCandidates: candidatesResult.count || 0,
        totalInterviews: interviewsResult.count || 0,
        totalEmployees: employeesResult.count || 0,
      });

      const stageCounts = {
        applied: 0,
        keep_in_view: 0,
        shortlisted: 0,
        rejected: 0,
      };

      stageResult.data?.forEach((candidate) => {
        if (candidate.status in stageCounts) {
          stageCounts[candidate.status as keyof typeof stageCounts]++;
        }
      });

      setCandidatesByStage([
        { name: 'Applied', value: stageCounts.applied, color: '#3B82F6' },
        { name: 'Keep in View', value: stageCounts.keep_in_view, color: '#F59E0B' },
        { name: 'Shortlisted', value: stageCounts.shortlisted, color: '#10B981' },
        { name: 'Rejected', value: stageCounts.rejected, color: '#EF4444' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your HR processes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={<Briefcase size={24} />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Candidates"
          value={stats.totalCandidates}
          icon={<Users size={24} />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Interviews"
          value={stats.totalInterviews}
          icon={<Bot size={24} />}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Employees"
          value={stats.totalEmployees}
          icon={<UserCheck size={24} />}
          color="orange"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidates by Stage</h3>
          {candidatesByStage.some(stage => stage.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={candidatesByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {candidatesByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No candidate data available
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h3>
          {candidatesByStage.some(stage => stage.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={candidatesByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No candidate data available
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.totalJobs === 0 && stats.totalCandidates === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <>
                {stats.totalJobs > 0 && (
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Job Postings Created</p>
                      <p className="text-sm text-gray-600">You have {stats.totalJobs} active job postings</p>
                    </div>
                  </div>
                )}
                {stats.totalCandidates > 0 && (
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">New Candidates</p>
                      <p className="text-sm text-gray-600">{stats.totalCandidates} candidates in your pipeline</p>
                    </div>
                  </div>
                )}
                {stats.totalInterviews > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AI Interviews</p>
                      <p className="text-sm text-gray-600">{stats.totalInterviews} interviews scheduled or completed</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/jobs"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-blue-900">Create New Job Posting</p>
              <p className="text-sm text-blue-700">Start hiring for a new position</p>
            </a>
            <a
              href="/dashboard/candidates"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-green-900">Review Candidates</p>
              <p className="text-sm text-green-700">Screen and manage applicants</p>
            </a>
            <a
              href="/dashboard/analytics"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-purple-900">View Analytics</p>
              <p className="text-sm text-purple-700">Track hiring performance</p>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};
