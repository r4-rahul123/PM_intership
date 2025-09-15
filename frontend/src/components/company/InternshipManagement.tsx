import React, { useState, useEffect } from 'react';
import { Company, Internship } from '../../types';
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign, X } from 'lucide-react';

interface InternshipManagementProps {
  company: Company;
}

const InternshipManagement: React.FC<InternshipManagementProps> = ({ company }) => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    skills: [''],
    location: '',
    duration: '',
    stipend: '',
    type: 'onsite' as 'remote' | 'onsite' | 'hybrid',
  });

  useEffect(() => {
    const allInternships: Internship[] = JSON.parse(localStorage.getItem('internships') || '[]');
    const companyInternships = allInternships.filter(i => i.companyId === company.id);
    setInternships(companyInternships);
  }, [company.id]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: [''],
      skills: [''],
      location: '',
      duration: '',
      stipend: '',
      type: 'onsite',
    });
    setEditingInternship(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allInternships: Internship[] = JSON.parse(localStorage.getItem('internships') || '[]');
    
    if (editingInternship) {
      // Update existing internship
      const updatedInternship: Internship = {
        ...editingInternship,
        ...formData,
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        skills: formData.skills.filter(s => s.trim() !== ''),
      };
      
      const internshipIndex = allInternships.findIndex(i => i.id === editingInternship.id);
      if (internshipIndex !== -1) {
        allInternships[internshipIndex] = updatedInternship;
      }
      
      setInternships(internships.map(i => i.id === editingInternship.id ? updatedInternship : i));
    } else {
      // Create new internship
      const newInternship: Internship = {
        id: Date.now().toString(),
        companyId: company.id,
        companyName: company.name,
        ...formData,
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        skills: formData.skills.filter(s => s.trim() !== ''),
        posted: new Date().toISOString(),
        applications: [],
      };
      
      allInternships.push(newInternship);
      setInternships([...internships, newInternship]);
    }
    
    localStorage.setItem('internships', JSON.stringify(allInternships));
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      title: internship.title,
      description: internship.description,
      requirements: internship.requirements.length > 0 ? internship.requirements : [''],
      skills: internship.skills.length > 0 ? internship.skills : [''],
      location: internship.location,
      duration: internship.duration,
      stipend: internship.stipend || '',
      type: internship.type,
    });
    setShowForm(true);
  };

  const handleDelete = (internshipId: string) => {
    if (confirm('Are you sure you want to delete this internship?')) {
      const allInternships: Internship[] = JSON.parse(localStorage.getItem('internships') || '[]');
      const updatedInternships = allInternships.filter(i => i.id !== internshipId);
      localStorage.setItem('internships', JSON.stringify(updatedInternships));
      
      setInternships(internships.filter(i => i.id !== internshipId));
    }
  };

  const updateArrayField = (field: 'requirements' | 'skills', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'requirements' | 'skills') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field: 'requirements' | 'skills', index: number) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Internship Postings</h2>
          <p className="text-gray-600 mt-1">Manage your internship opportunities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Post Internship</span>
        </button>
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No internships posted</h3>
          <p className="text-gray-600 mb-4">
            Start by posting your first internship opportunity
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Your First Internship
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{internship.title}</h3>
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
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span>Posted: {new Date(internship.posted).toLocaleDateString()}</span>
                    <span className="ml-4">Applications: {internship.applications.length}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(internship)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internship Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingInternship ? 'Edit Internship' : 'Post New Internship'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internship Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Product Management Intern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mumbai, India or Remote"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 3 months, Summer 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="onsite">On-site</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stipend (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.stipend}
                      onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. 4000/month, Unpaid"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the internship role, responsibilities, and what the intern will learn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Currently pursuing a degree in Business, Marketing, or related field"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('requirements', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('requirements')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Requirement
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateArrayField('skills', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Data Analysis, Market Research, Excel"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField('skills', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('skills')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingInternship ? 'Update Internship' : 'Post Internship'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipManagement;