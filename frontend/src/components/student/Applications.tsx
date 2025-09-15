import React, { useState, useEffect } from 'react';
import { Student, Internship, Application } from '../../types';
import { Clock, CheckCircle, XCircle, Calendar, Star } from 'lucide-react';

interface ApplicationsProps {
  student: Student;
  internships: Internship[];
}

const Applications: React.FC<ApplicationsProps> = ({ student, internships }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const allApplications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');
    const studentApplications = allApplications.filter(app => app.studentId === student.id);
    setApplications(studentApplications);
  }, [student.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getInternshipDetails = (internshipId: string) => {
    return internships.find(i => i.id === internshipId);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-600">
          Start applying to internships from your matches to see them here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Applications</h2>
        <p className="text-gray-600">
          You have applied to {applications.length} internship{applications.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((application) => {
          const internship = getInternshipDetails(application.internshipId);
          if (!internship) return null;

          return (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                  </div>
                  <p className="text-lg font-medium text-blue-600 mb-2">{internship.companyName}</p>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{application.matchScore}% match</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Location:</span> {internship.location}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {internship.duration}
                </div>
                <div>
                  <span className="font-medium">Type:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                    internship.type === 'hybrid' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {internship.type}
                  </span>
                </div>
              </div>

              {application.status === 'accepted' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Congratulations! You've been accepted.</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    The company will contact you soon with next steps.
                  </p>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Application not selected</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Keep applying! There are many other great opportunities.
                  </p>
                </div>
              )}

              {application.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Application under review</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Your application is being reviewed by the company. We'll notify you once there's an update.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Applications;