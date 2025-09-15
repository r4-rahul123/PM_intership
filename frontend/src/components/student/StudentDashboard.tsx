import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Student, Internship, Match } from '../../types';
import { getTopMatches } from '../../utils/matching';
import StudentProfile from './StudentProfile';
import MatchedInternships from './MatchedInternships';
import Applications from './Applications';
import { User, Target, FileText } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('matches');
  const [student, setStudent] = useState<Student | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (currentUser) {
      setStudent(currentUser as Student);
      
      // Load internships
      const allInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      setInternships(allInternships);
      
      if (currentUser && allInternships.length > 0) {
        const topMatches = getTopMatches(currentUser as Student, allInternships, 10);
        setMatches(topMatches);
      }
    }
  }, [currentUser]);

  if (!student) return null;

  const tabs = [
    { id: 'matches', label: 'Matches', icon: Target },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}</h1>
        <p className="text-gray-600 mt-2">{student.university} • {student.major}</p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'matches' && (
          <MatchedInternships
            matches={matches}
            internships={internships}
            student={student}
            onStudentUpdate={setStudent}
          />
        )}
        {activeTab === 'applications' && (
          <Applications student={student} internships={internships} />
        )}
        {activeTab === 'profile' && (
          <StudentProfile student={student} onUpdate={setStudent} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;