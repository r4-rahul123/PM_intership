import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import Navbar from './components/common/Navbar';
import StudentDashboard from './components/student/StudentDashboard';
import CompanyDashboard from './components/company/CompanyDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { Student, Company, Internship } from './types';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  // Initialize sample data on first load
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      // Initialize with sample data
      const sampleUsers = [
        {
          id: '1',
          email: 'admin@internmatch.com',
          role: 'admin',
          name: 'Admin User',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'student@example.com',
          role: 'student',
          name: 'Nikunj Jain',
          university: 'IIT Bombay',
          major: 'Computer Science',
          gpa: 3.8,
          graduationYear: 2025,
          location: 'Karnataka, India',
          skills: ['Python', 'Data Analysis', 'Product Management', 'SQL', 'Figma'],
          interests: ['Technology', 'Product Development', 'User Experience', 'Data Science'],
          experience: 'Led product development for a mobile app with 10k+ users. Conducted user research and A/B testing to improve engagement by 25%.',
          portfolio: 'https://alice-portfolio.com',
          resume: 'https://drive.google.com/alice-resume',
          applications: [],
          matches: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          email: 'company@techcorp.com',
          role: 'company',
          name: 'TechCorp Inc',
          industry: 'Technology',
          size: '201-500',
          location: 'Delhi, India',
          description: 'Leading technology company focused on AI and machine learning solutions.',
          website: 'https://techcorp.com',
          internships: [],
          applications: [],
          createdAt: new Date().toISOString(),
        },
      ];

      const sampleInternships: Internship[] = [
        {
          id: '1',
          companyId: '3',
          companyName: 'TechCorp Inc',
          title: 'Product Management Intern',
          description: 'Join our product team to help define and build the next generation of AI-powered products.',
          requirements: [
            'Currently pursuing a degree in Business, Engineering, or related field',
            'Strong analytical and problem-solving skills',
            'Interest in technology and product development',
            'Excellent communication skills',
          ],
          skills: ['Product Management', 'Data Analysis', 'User Research', 'SQL'],
          location: 'Mumbai, India or Remote',
          duration: '12 weeks (Summer 2025)',
          stipend: '6000/month',
          type: 'hybrid',
          posted: new Date().toISOString(),
          applications: [],
        },
        {
          id: '2',
          companyId: '3',
          companyName: 'TechCorp Inc',
          title: 'UX Research Intern',
          description: 'Work with our design team to conduct user research and improve product experiences.',
          requirements: [
            'Studying HCI, Psychology, Design, or related field',
            'Experience with user research methodologies',
            'Familiarity with design tools',
          ],
          skills: ['User Research', 'Figma', 'Data Analysis', 'Survey Design'],
          location: 'Delhi, India',
          duration: '10 weeks',
          stipend: '5500/month',
          type: 'onsite',
          posted: new Date().toISOString(),
          applications: [],
        },
      ];

      localStorage.setItem('users', JSON.stringify(sampleUsers));
      localStorage.setItem('internships', JSON.stringify(sampleInternships));
      localStorage.setItem('applications', JSON.stringify([]));
    }
  }, []);

  if (!currentUser) {
    return <AuthForm />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'student':
        return <StudentDashboard />;
      case 'company':
        return <CompanyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {renderDashboard()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;