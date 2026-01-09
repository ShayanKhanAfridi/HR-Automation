  # HR Automation Platform Database Schema

  1. New Tables
    - `jobs`
      - Job postings with status tracking
      - Includes job details, banner image, and posting platforms
    
    - `candidates`
      - Candidate information and screening status
      - Links to jobs, tracks application stage
    
    - `interviews`
      - AI interview records
      - Status tracking and transcript storage
    
    - `employees`
      - Employee records post-hiring
      - Performance and onboarding data
    
    - `attendance`
      - Daily attendance logs
      - Check-in/check-out times
    
    - `payroll`
      - Monthly salary records
      - Payment status tracking
    
    - `company_settings`
      - Company configuration
      - API keys and preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their company's data
    - Users can only access data for their own company/organization
*/

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  banner_image_url text,
  posted_to_linkedin boolean DEFAULT false,
  posted_to_instagram boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Applicants table (mirrors legacy intake)
CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number varchar(20),
  email text NOT NULL,
  application_message text,
  resume_drive_url text,
  resume_drive_file_id text,
  resume_filename text,
  subject text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view applicants"
  ON applicants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service roles can manage applicants"
  ON applicants FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO applicants (full_name, phone_number, email, application_message, resume_drive_url, resume_filename, subject)
VALUES
  ('Ayesha Khan', '+92 300 1234567', 'ayesha.khan@example.com', 'Excited to apply for the HR Manager role.', 'https://drive.google.com/file/d/ayesha-resume', 'Ayesha_Khan_Resume.pdf', 'HR Manager Application'),
  ('Bilal Ahmed', '+92 321 7654321', 'bilal.ahmed@example.com', 'Attaching my resume for the AI Recruiter position.', 'https://drive.google.com/file/d/bilal-resume', 'Bilal_Ahmed_Resume.pdf', 'AI Recruiter Application'),
  ('Sana Malik', '+92 333 1112233', 'sana.malik@example.com', 'Looking forward to discussing the Talent Lead opportunity.', 'https://drive.google.com/file/d/sana-resume', 'Sana_Malik_Resume.pdf', 'Talent Lead Application')
ON CONFLICT DO NOTHING;


-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  scheduled_at timestamptz,
  status text DEFAULT 'pending',
  transcript text DEFAULT '',
  ai_analysis text DEFAULT '',
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  department text DEFAULT '',
  experience_years integer DEFAULT 0,
  tasks_assigned integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  on_time_submissions integer DEFAULT 0,
  avg_task_time numeric DEFAULT 0,
  attendance_percentage numeric DEFAULT 0,
  communication_score integer DEFAULT 0,
  teamwork_score integer DEFAULT 0,
  problem_solving_score integer DEFAULT 0,
  learning_speed integer DEFAULT 0,
  initiative_score integer DEFAULT 0,
  performance_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employees"
  ON employees FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own employees"
  ON employees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  status text DEFAULT 'present',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance"
  ON attendance FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  base_salary numeric DEFAULT 0,
  bonuses numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  net_salary numeric DEFAULT 0,
  status text DEFAULT 'pending',
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payroll"
  ON payroll FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payroll"
  ON payroll FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payroll"
  ON payroll FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payroll"
  ON payroll FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Company settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  company_name text DEFAULT '',
  company_logo text,
  ai_api_key text DEFAULT '',
  linkedin_integration boolean DEFAULT false,
  instagram_integration boolean DEFAULT false,
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON company_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON company_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON company_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON company_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_created_at ON applicants(created_at);
CREATE INDEX IF NOT EXISTS idx_interviews_applicant_id ON interviews(applicant_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_performance_score ON employees(performance_score);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);


