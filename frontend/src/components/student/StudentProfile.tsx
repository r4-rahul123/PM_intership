import React, { useState, useRef } from 'react';
import { Student } from '../../types';
import { Save, Plus, X, Upload } from 'lucide-react';


interface StudentProfileProps {
  student: Student;
  onUpdate: (student: Student) => void;
}

const StudentProfile = ({ student, onUpdate }: StudentProfileProps): JSX.Element => {
  // --- All State Declarations ---
  const [formData, setFormData] = useState(student);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // State for profile picture
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(student.profilePictureUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for resume parsing
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // --- All Handler Functions ---

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      const typedKey = key as keyof Student;
      const value = formData[typedKey];
      if (Array.isArray(value)) {
        value.forEach(item => data.append(key, item));
      } else if (value !== undefined && value !== null) {
        data.append(key, String(value));
      }
    });
    if (imageFile) {
      data.append('profileImage', imageFile);
    }
    try {
      const response = await fetch(`http://localhost:5000/api/students/${formData.email}`, {
        method: 'PUT',
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update.');
      alert('Profile updated successfully!');
      onUpdate(result.student);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleResumeParse = async () => {
  if (!resumeFile) {
    alert('Please select a resume file first.');
    return;
  }

  const data = new FormData();
  // Updated: The FastAPI endpoint expects the key 'file'
  data.append('file', resumeFile);

  try {
    // Updated: The URL now points to your FastAPI server
    const response = await fetch(`http://127.0.0.1:8000/candidates/${formData.email}/parse-resume`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    if (!response.ok) {
      // FastAPI sends detailed errors in a 'detail' field
      const errorMessage = result.detail || 'Failed to parse resume.';
      throw new Error(errorMessage);
    }

    alert('Resume parsed successfully!');

    // Update the form state with the rich data from the Python parser
    setFormData({
      ...formData, // Keep existing data
      name: result.name,
      email: result.email, // This might overwrite, be mindful
      location: result.location,
      skills: result.skills, // Overwrite skills with parsed data
    });

    setResumeFile(null); // Clear the file input
    if (resumeFileInputRef.current) {
      resumeFileInputRef.current.value = "";
    }

  } catch (error) {
    alert(`Error: ${(error as Error).message}`);
  }
};

  const addSkill = () => { if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) { setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] }); setNewSkill(''); } };
  const removeSkill = (skillToRemove: string) => { setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) }); };
  const addInterest = () => { if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) { setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] }); setNewInterest(''); } };
  const removeInterest = (interestToRemove: string) => { setFormData({ ...formData, interests: formData.interests.filter(i => i !== interestToRemove) }); };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <p className="text-gray-600 mt-1">Update your profile to get better matches</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* --- Profile Picture Upload UI (Existing) --- */}
        <div className="flex items-center space-x-6">
          <img src={imagePreview || 'https://via.placeholder.com/150'} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
          <div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Change Picture</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB.</p>
          </div>
        </div>
        
        {/* --- Main Profile Fields (Existing) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={formData.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">University</label><input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Major</label><input type="text" value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">GPA</label><input type="number" step="0.01" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label><input type="number" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, State" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/></div>
        </div>
        
        {/* --- Skills and Interests (Existing) --- */}
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Skills</label><div className="flex flex-wrap gap-2 mb-3">{formData.skills.map((skill) => (<span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">{skill}<button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-blue-600 hover:text-blue-800"><X className="w-3 h-3" /></button></span>))}</div><div className="flex space-x-2"><input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"/><button type="button" onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="w-4 h-4" /></button></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Interests</label><div className="flex flex-wrap gap-2 mb-3">{formData.interests.map((interest) => (<span key={interest} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">{interest}<button type="button" onClick={() => removeInterest(interest)} className="ml-2 text-green-600 hover:text-green-800"><X className="w-3 h-3" /></button></span>))}</div><div className="flex space-x-2"><input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add an interest" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"/><button type="button" onClick={addInterest} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Plus className="w-4 h-4" /></button></div></div>

        {/* --- Resume Parsing UI (Newly Integrated) --- */}
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Parse Skills from Resume</label>
          <p className="text-xs text-gray-500 mb-3">Upload a PDF to automatically extract and add skills to your profile.</p>
          <div className="flex items-center space-x-2">
            <input type="file" accept=".pdf" ref={resumeFileInputRef} onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
            <button type="button" onClick={() => resumeFileInputRef.current?.click()} className="flex-1 px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              {resumeFile ? resumeFile.name : 'Choose Resume File...'}
            </button>
            <button type="button" onClick={handleResumeParse} disabled={!resumeFile} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
              Parse & Add Skills
            </button>
          </div>
        </div>

        {/* --- Save Button --- */}
        <div className="flex justify-end">
          <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;