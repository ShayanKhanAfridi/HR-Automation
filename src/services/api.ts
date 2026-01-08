const API_BASE_URL = '/api';

export const aiService = {
  extractJobDetails: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/ai/job-extraction`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract job details');
    }

    return response.json();
  },

  getInterviewTranscript: async (interviewId: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/interview-transcript/${interviewId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch interview transcript');
    }

    return response.json();
  },

  screenCandidate: async (candidateId: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/screen-candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidateId }),
    });

    if (!response.ok) {
      throw new Error('Failed to screen candidate');
    }

    return response.json();
  },

  analyzePerformance: async (employeeId: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-performance/${employeeId}`);

    if (!response.ok) {
      throw new Error('Failed to analyze performance');
    }

    return response.json();
  },
};

export const socialService = {
  postToLinkedIn: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}/social/linkedin/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });

    if (!response.ok) {
      throw new Error('Failed to post to LinkedIn');
    }

    return response.json();
  },

  postToInstagram: async (jobId: string) => {
    const response = await fetch(`${API_BASE_URL}/social/instagram/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    });

    if (!response.ok) {
      throw new Error('Failed to post to Instagram');
    }

    return response.json();
  },
};
