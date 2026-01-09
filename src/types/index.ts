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
  banner_image_url: string | null;
  posted_to_linkedin: boolean;
  posted_to_instagram: boolean;
  created_at: string;
  updated_at: string;
}

export interface Applicant {
  id: string;
  full_name: string;
  phone_number?: string | null;
  email: string;
  application_message?: string | null;
  resume_drive_url?: string | null;
  resume_drive_file_id?: string | null;
  resume_filename?: string | null;
  subject?: string | null;
  created_at?: string | null;
}

export interface SocialJobPosting {
  job_id: string;
  job_title: string;
  job_description: string;
  location: string;
  posted_on: string | null;
  fb_id: number;
  linkedinn_id: string | null;
}

export interface ResumeScreeningResult {
  id: string;
  email?: string | null;
  phone_number?: string | null;
  resume_drive_url?: string | null;
  resume_drive_file_id?: string | null;
  resume_filename?: string | null;
  skills_score?: number | null;
  experience_score?: number | null;
  education_score?: number | null;
  overall_score?: number | null;
  applicant_skill?: string | null;
  reason_summary?: string | null;
  decision?: 'shortlisted' | 'kiv' | 'rejected' | null;
  status?: 'SHORTLISTED' | 'KIV' | 'REJECTED' | null;
  subject?: string | null;
  full_name?: string | null;
}

export interface Interview {
  id: string;
  applicant_id: string;
  user_id: string;
  scheduled_at: string | null;
  status: 'pending' | 'completed';
  transcript?: string | null;
  ai_analysis?: string | null;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  user_id: string;
  name: string;
  role: string;
  department: string;
  experience_years: number;
  tasks_assigned: number;
  tasks_completed: number;
  on_time_submissions: number;
  avg_task_time: number;
  attendance_percentage: number;
  communication_score: number;
  teamwork_score: number;
  problem_solving_score: number;
  learning_speed: number;
  initiative_score: number;
  performance_score: number;
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
