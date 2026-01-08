import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalEmployees: 0,
    avgTimeToHire: 0,
  });

  const [candidatesByStage, setCandidatesByStage] = useState<any[]>([]);
  const [hiringTrend, setHiringTrend] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [jobs, candidates, employees] = await Promise.all([
      supabase.from('jobs').select('*').eq('user_id', user.id),
      supabase.from('candidates').select('*').eq('user_id', user.id),
      supabase.from('employees').select('*').eq('user_id', user.id),
    ]);

    setStats({
      totalJobs: jobs.data?.length || 0,
      totalCandidates: candidates.data?.length || 0,
      totalEmployees: employees.data?.length || 0,
      avgTimeToHire: 12,
    });

    const stageCounts = {
      applied: 0,
      keep_in_view: 0,
      shortlisted: 0,
      rejected: 0,
    };

    candidates.data?.forEach((candidate) => {
      if (candidate.status in stageCounts) {
        stageCounts[candidate.status as keyof typeof stageCounts]++;
      }
    });

    setCandidatesByStage([
      { name: 'Applied', value: stageCounts.applied, color: '#3B82F6' },
      { name: 'In Review', value: stageCounts.keep_in_view, color: '#F59E0B' },
      { name: 'Shortlisted', value: stageCounts.shortlisted, color: '#10B981' },
      { name: 'Rejected', value: stageCounts.rejected, color: '#EF4444' },
    ]);

    setHiringTrend([
      { month: 'Jan', applications: 45, hired: 8 },
      { month: 'Feb', applications: 52, hired: 12 },
      { month: 'Mar', applications: 61, hired: 15 },
      { month: 'Apr', applications: 48, hired: 10 },
      { month: 'May', applications: 70, hired: 18 },
      { month: 'Jun', applications: 65, hired: 14 },
    ]);

    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your hiring performance and workforce metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalJobs}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 mb-1">Total Candidates</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalCandidates}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 mb-1">Employees Hired</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalEmployees}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 mb-1">Avg Time to Hire</p>
          <p className="text-3xl font-bold text-orange-600">{stats.avgTimeToHire}d</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Funnel</h3>
          {candidatesByStage.some(stage => stage.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={candidatesByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
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
              No data available
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications vs Hires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3B82F6" name="Applications" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hired" fill="#10B981" name="Hired" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hiringTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applications" />
            <Line type="monotone" dataKey="hired" stroke="#10B981" strokeWidth={2} name="Hired" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
