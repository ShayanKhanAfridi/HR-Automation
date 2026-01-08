export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employment_type: string;
  salary_range: string;
  banner_image_url: string | null;
  status: string;
  posted_to_linkedin: boolean;
  posted_to_instagram: boolean;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  job_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string | null;
  cover_letter: string;
  status: 'applied' | 'keep_in_view' | 'shortlisted' | 'rejected';
  stage: string;
  score: number;
  ai_screening_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  user_id: string;
  scheduled_at: string | null;
  status: 'pending' | 'completed';
  transcript: string;
  ai_analysis: string;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  candidate_id: string | null;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employee_id: string | null;
  joining_date: string;
  salary: number;
  onboarding_status: 'pending' | 'in_progress' | 'completed';
  performance_score: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  user_id: string;
  month: number;
  year: number;
  base_salary: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'paid';
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  user_id: string;
  company_name: string;
  company_logo: string | null;
  ai_api_key: string;
  linkedin_integration: boolean;
  instagram_integration: boolean;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}
