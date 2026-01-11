import { useEffect, useState } from 'react';
import { UserCheck, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Employee } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Onboarding = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .order('joining_date', { ascending: false });

    setEmployees(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const performanceData = employees.map(emp => ({
    name: emp.name.split(' ')[0],
    performance: emp.performance_score,
  }));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboarding Performance Analysis</h1>
        <p className="text-gray-600">Track employee onboarding and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Onboarding Complete</p>
            <p className="text-3xl font-bold text-gray-900">
              {employees.filter(e => (e.onboarding_status ?? 'pending') === 'completed').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Avg Performance Score</p>
            <p className="text-3xl font-bold text-gray-900">
              {employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.performance_score, 0) / employees.length) : 0}
            </p>
          </div>
        </Card>
      </div>

      {employees.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="performance" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Onboarding Status</h3>
        {employees.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No employees yet</p>
        ) : (
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{employee.name}</h4>
                    <p className="text-sm text-gray-600">
                      {(employee.position || 'Role TBD')} • {employee.department || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-lg font-semibold text-blue-600">{employee.performance_score}/100</p>
                  </div>
                  {(() => {
                    const status = employee.onboarding_status ?? 'pending';
                    return (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {status.replace('_', ' ')}
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
