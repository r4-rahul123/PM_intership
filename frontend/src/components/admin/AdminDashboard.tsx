import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Student, Company, Internship, Application } from '../../types';
import { Users, Building, Briefcase, FileText, TrendingUp, Star } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalApplications: 0,
    acceptedApplications: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const allInternships: Internship[] = JSON.parse(localStorage.getItem('internships') || '[]');
    const allApplications: Application[] = JSON.parse(localStorage.getItem('applications') || '[]');

    setUsers(allUsers);
    setInternships(allInternships);
    setApplications(allApplications);

    // Calculate stats
    const students = allUsers.filter(u => u.role === 'student');
    const companies = allUsers.filter(u => u.role === 'company');
    const accepted = allApplications.filter(a => a.status === 'accepted');

    setStats({
      totalUsers: allUsers.length,
      totalStudents: students.length,
      totalCompanies: companies.length,
      totalInternships: allInternships.length,
      totalApplications: allApplications.length,
      acceptedApplications: accepted.length,
    });
  }, []);

  const getMatchingSuccessRate = () => {
    if (stats.totalApplications === 0) return 0;
    return Math.round((stats.acceptedApplications / stats.totalApplications) * 100);
  };

  const getTopCompanies = () => {
    const companiesWithApps = applications.reduce((acc, app) => {
      const internship = internships.find(i => i.id === app.internshipId);
      if (internship) {
        acc[internship.companyName] = (acc[internship.companyName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(companiesWithApps)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getRecentApplications = () => {
    return applications
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 10);
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
    { title: 'Students', value: stats.totalStudents, icon: Users, color: 'green' },
    { title: 'Companies', value: stats.totalCompanies, icon: Building, color: 'purple' },
    { title: 'Internships', value: stats.totalInternships, icon: Briefcase, color: 'indigo' },
    { title: 'Applications', value: stats.totalApplications, icon: FileText, color: 'yellow' },
    { title: 'Success Rate', value: `${getMatchingSuccessRate()}%`, icon: TrendingUp, color: 'pink' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      purple: 'bg-purple-500 text-purple-100',
      indigo: 'bg-indigo-500 text-indigo-100',
      yellow: 'bg-yellow-500 text-yellow-100',
      pink: 'bg-pink-500 text-pink-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage the internship matching system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Companies</h3>
          <div className="space-y-3">
            {getTopCompanies().map(([company, count]) => (
              <div key={company} className="flex justify-between items-center">
                <span className="text-gray-900">{company}</span>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {count} applications
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {getRecentApplications().map((application) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'accepted':
                    return 'text-green-600 bg-green-100';
                  case 'rejected':
                    return 'text-red-600 bg-red-100';
                  default:
                    return 'text-yellow-600 bg-yellow-100';
                }
              };

              return (
                <div key={application.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{application.studentName}</p>
                    <p className="text-sm text-gray-600">{application.internshipTitle}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 10).map((user) => {
                  const getRoleColor = (role: string) => {
                    switch (role) {
                      case 'student':
                        return 'text-green-600 bg-green-100';
                      case 'company':
                        return 'text-blue-600 bg-blue-100';
                      case 'admin':
                        return 'text-purple-600 bg-purple-100';
                      default:
                        return 'text-gray-600 bg-gray-100';
                    }
                  };

                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            {(user as Student).name || (user as Company).name || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;