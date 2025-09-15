export interface User {
  id: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  createdAt: string;
}

export interface Student extends User {
  name: string;
  university: string;
  major: string;
  gpa: number;
  graduationYear: number;
  location: string;
  skills: string[];
  interests: string[];
  experience: string;
  portfolio?: string;
  resume?: string;
  applications: string[];
  matches: Match[];
  profilePictureUrl?: string; 
}

export interface Company extends User {
  name: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  internships: Internship[];
  applications: Application[];
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  duration: string;
  stipend?: string;
  type: 'remote' | 'onsite' | 'hybrid';
  posted: string;
  applications: string[];
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  studentName: string;
  internshipTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  matchScore: number;
}

export interface Match {
  internshipId: string;
  score: number;
  factors: {
    skills: number;
    location: number;
    interests: number;
    experience: number;
    gpa: number;
  };
}

export interface Admin extends User {
  name: string;
}