import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionValid(!!data.session);
    };

    verifySession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      showToast(error.message, 'error');
    } else {
      setSuccess(true);
      showToast('Password updated successfully. You can now sign in.', 'success');
      setTimeout(() => navigate('/login'), 2000);
    }

    setIsLoading(false);
  };

  if (sessionValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">HireAI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set a new password</h1>
          <p className="text-gray-600">
            {sessionValid
              ? 'Enter your new password below to finish resetting your account.'
              : 'This reset link is invalid or expired. Please request a new one.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {sessionValid ? (
            <form onSubmit={handleReset} className="space-y-6">
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />

              <Button type="submit" className="w-full" isLoading={isLoading || success}>
                Update Password
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Return to the forgot password page to request a fresh link.</p>
              <Button variant="outline" onClick={() => navigate('/forgot-password')} className="w-full">
                Go to Forgot Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
