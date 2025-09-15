import React, { useState } from 'react';
import { Student, Internship, Match } from '../../types';
import { MapPin, Clock, DollarSign, Star, Send, ExternalLink } from 'lucide-react';

interface MatchedInternshipsProps {
  matches: Match[];
  internships: Internship[];
  student: Student;
  onStudentUpdate: (student: Student) => void;
}

const MatchedInternships: React.FC<MatchedInternshipsProps> = ({
  matches,
  internships,
  student,
  onStudentUpdate,
}) => {
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  const getMatchedInternships = () => {
    return matches.map(match => ({
      match,
      internship: internships.find(i => i.id === match.internshipId)!
    })).filter(item => item.internship);
  };

  const applyToInternship = (internshipId: string) => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const newApplication = {
      id: Date.now().toString(),
      studentId: student.id,
      internshipId,
      studentName: student.name,
      internshipTitle: internships.find(i => i.id === internshipId)?.title || '',
      status: 'pending' as const,
      appliedAt: new Date().toISOString(),
      matchScore: matches.find(m => m.internshipId === internshipId)?.score || 0,
    };

    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Update student's applications
    const updatedStudent = {
      ...student,
      applications: [...student.applications, internshipId]
    };
    
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === student.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedStudent;
      localStorage.setItem('users', JSON.stringify(users));
    }

    onStudentUpdate(updatedStudent);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const hasApplied = (internshipId: string) => {
    return student.applications.includes(internshipId);
  };

  const matchedInternships = getMatchedInternships();

  if (matchedInternships.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
        <p className="text-gray-600 mb-4">
          Complete your profile to get personalized internship recommendations
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Matches</h2>
        <p className="text-gray-600">
          Found {matchedInternships.length} internships that match your profile
        </p>
      </div>

      <div className="grid gap-6">
        {matchedInternships.map(({ match, internship }) => (
          <div
            key={internship.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(match.score)}`}>
                    {match.score}% match
                  </span>
                </div>
                <p className="text-lg font-medium text-blue-600 mb-1">{internship.companyName}</p>
                <p className="text-gray-600 mb-3">{internship.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{internship.duration}</span>
                  </div>
                  {internship.stipend && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{internship.stipend}</span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                    internship.type === 'hybrid' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {internship.type}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Match Breakdown:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(match.factors).map(([factor, score]) => (
                      <div key={factor} className="text-center">
                        <div className="text-xs text-gray-600 capitalize mb-1">{factor}</div>
                        <div className={`text-sm font-medium px-2 py-1 rounded ${getScoreColor(score)}`}>
                          {Math.round(score)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedInternship(internship)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Details</span>
              </button>
              
              {hasApplied(internship.id) ? (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <span>Applied</span>
                </div>
              ) : (
                <button
                  onClick={() => applyToInternship(internship.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for internship details */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedInternship.title}</h2>
                  <p className="text-lg text-blue-600 font-medium">{selectedInternship.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedInternship.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedInternship.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {!hasApplied(selectedInternship.id) && (
                  <button
                    onClick={() => {
                      applyToInternship(selectedInternship.id);
                      setSelectedInternship(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchedInternships;