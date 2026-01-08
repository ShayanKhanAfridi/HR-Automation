import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../lib/supabase';

export const Settings = () => {
  const [companyName, setCompanyName] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');
  const [linkedinIntegration, setLinkedinIntegration] = useState(false);
  const [instagramIntegration, setInstagramIntegration] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setCompanyName(data.company_name);
      setAiApiKey(data.ai_api_key);
      setLinkedinIntegration(data.linkedin_integration);
      setInstagramIntegration(data.instagram_integration);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('company_settings')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('company_settings')
        .update({
          company_name: companyName,
          ai_api_key: aiApiKey,
          linkedin_integration: linkedinIntegration,
          instagram_integration: instagramIntegration,
        })
        .eq('user_id', user.id);

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Settings saved successfully!', 'success');
      }
    } else {
      const { error } = await supabase.from('company_settings').insert({
        user_id: user.id,
        company_name: companyName,
        ai_api_key: aiApiKey,
        linkedin_integration: linkedinIntegration,
        instagram_integration: instagramIntegration,
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Settings saved successfully!', 'success');
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your company settings and integrations</p>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="space-y-4">
          <Input
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
        <div className="space-y-4">
          <Input
            label="AI API Key"
            type="password"
            value={aiApiKey}
            onChange={(e) => setAiApiKey(e.target.value)}
            placeholder="Enter your AI API key"
            helperText="This key is used to connect with external AI services for candidate screening and interviews"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Integrations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">LinkedIn</h4>
              <p className="text-sm text-gray-600">Post jobs directly to LinkedIn</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={linkedinIntegration}
                onChange={(e) => setLinkedinIntegration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Instagram</h4>
              <p className="text-sm text-gray-600">Share job postings on Instagram</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={instagramIntegration}
                onChange={(e) => setInstagramIntegration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
