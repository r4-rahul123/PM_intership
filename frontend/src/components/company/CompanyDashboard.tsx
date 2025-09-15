import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Company, Internship, Application } from '../../types';
import CompanyProfile from './CompanyProfile';
import InternshipManagement from './InternshipManagement';
import CandidateReview from './CandidateReview';
import { Building, Plus, Users, FileText } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('internships');
  const [company, setCompany] = useState<Company | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (currentUser) {
      setCompany(currentUser as Company);
      
      // Load applications for this company's internships
      const allApplications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');
      const companyApplications = allApplications.filter(app => {
        const internships: Internship[] = JSON.parse(localStorage.getItem('internships') || '[]');
        const internship = internships.find(i => i.id === app.internshipId);
        return internship?.companyId === currentUser.id;
      });
      setApplications(companyApplications);
    }
  }, [currentUser]);

  if (!company) return null;

  const tabs = [
    { id: 'internships', label: 'Internships', icon: Plus },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'profile', label: 'Profile', icon: Building },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
        <p className="text-gray-600 mt-2">{company.industry} • {company.size}</p>
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
              {tab.id === 'candidates' && applications.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs rounded-full px-2 py-1 ml-1">
                  {applications.filter(a => a.status === 'pending').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'internships' && (
          <InternshipManagement company={company} onCompanyUpdate={setCompany} />
        )}
        {activeTab === 'candidates' && (
          <CandidateReview company={company} applications={applications} />
        )}
        {activeTab === 'profile' && (
          <CompanyProfile company={company} onUpdate={setCompany} />
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;