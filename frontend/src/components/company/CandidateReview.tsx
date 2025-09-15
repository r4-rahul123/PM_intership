import React, { useState, useEffect } from 'react';
import { Company, Application, Student } from '../../types';
import { CheckCircle, XCircle, User, Star, Mail, GraduationCap, ExternalLink } from 'lucide-react';

interface CandidateReviewProps {
  company: Company;
  applications: Application[];
}

const CandidateReview: React.FC<CandidateReviewProps> = ({ company, applications }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allStudents = allUsers.filter((user: any) => user.role === 'student');
    setStudents(allStudents);
  }, []);

  const updateApplicationStatus = (applicationId: string, status: 'accepted' | 'rejected') => {
    const allApplications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');
    const applicationIndex = allApplications.findIndex(app => app.id === applicationId);
    
    if (applicationIndex !== -1) {
      allApplications[applicationIndex].status = status;
      localStorage.setItem('applications', JSON.stringify(allApplications));
    }
  };

  const getStudentDetails = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-600">
          Once students start applying to your internships, you'll see them here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Applications</h2>
        <div className="flex space-x-6 text-sm text-gray-600">
          <span>Total: {applications.length}</span>
          <span>Pending: {pendingApplications.length}</span>
          <span>Accepted: {applications.filter(a => a.status === 'accepted').length}</span>
          <span>Rejected: {applications.filter(a => a.status === 'rejected').length}</span>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Review ({pendingApplications.length})
          </h3>
          <div className="space-y-4">
            {pendingApplications.map((application) => {
              const student = getStudentDetails(application.studentId);
              if (!student) return null;

              return (
                <div
                  key={application.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          <Star className="w-4 h-4 inline mr-1" />
                          {application.matchScore}% match
                        </span>
                      </div>
                      
                      <div className="text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>{student.university} • {student.major} • GPA: {student.gpa}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 mb-2">Applied for:</h4>
                        <p className="text-blue-600 font-medium">{application.internshipTitle}</p>
                      </div>

                      <div className="mt-3">
                        <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {student.experience && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Experience:</h4>
                          <p className="text-gray-600 text-sm">{student.experience}</p>
                        </div>
                      )}

                      <div className="mt-3 text-sm text-gray-500">
                        Applied: {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      {student.portfolio && (
                        <a
                          href={student.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Portfolio</span>
                        </a>
                      )}
                      {student.resume && (
                        <a
                          href={student.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Resume</span>
                        </a>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application.id, 'accepted')}
                        className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApplications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reviewed Applications ({reviewedApplications.length})
          </h3>
          <div className="space-y-4">
            {reviewedApplications.map((application) => {
              const student = getStudentDetails(application.studentId);
              if (!student) return null;

              const isAccepted = application.status === 'accepted';

              return (
                <div
                  key={application.id}
                  className={`bg-white rounded-xl shadow-sm border p-6 ${
                    isAccepted ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          isAccepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isAccepted ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                          {application.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      </div>
                      
                      <p className="text-blue-600 font-medium mb-2">{application.internshipTitle}</p>
                      <div className="text-gray-600 text-sm">
                        {student.university} • {student.major} • {application.matchScore}% match
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateReview;