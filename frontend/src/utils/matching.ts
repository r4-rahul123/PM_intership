import { Student, Internship, Match } from '../types';

export const calculateMatchScore = (student: Student, internship: Internship): Match => {
  const factors = {
    skills: calculateSkillsMatch(student.skills, internship.skills),
    location: calculateLocationMatch(student.location, internship.location),
    interests: calculateInterestsMatch(student.interests, internship.requirements),
    experience: calculateExperienceMatch(student.experience),
    gpa: calculateGpaScore(student.gpa),
  };

  const weightedScore = 
    factors.skills * 0.3 +
    factors.location * 0.2 +
    factors.interests * 0.25 +
    factors.experience * 0.15 +
    factors.gpa * 0.1;

  return {
    internshipId: internship.id,
    score: Math.round(weightedScore),
    factors,
  };
};

const calculateSkillsMatch = (studentSkills: string[], requiredSkills: string[]): number => {
  if (requiredSkills.length === 0) return 80;
  
  const matchingSkills = studentSkills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  );
  
  return Math.min(100, (matchingSkills.length / requiredSkills.length) * 100);
};

const calculateLocationMatch = (studentLocation: string, internshipLocation: string): number => {
  if (internshipLocation.toLowerCase().includes('remote')) return 100;
  if (studentLocation.toLowerCase() === internshipLocation.toLowerCase()) return 100;
  
  // Basic city/state matching logic
  const studentParts = studentLocation.toLowerCase().split(',');
  const internshipParts = internshipLocation.toLowerCase().split(',');
  
  if (studentParts.some(part => internshipParts.includes(part.trim()))) return 75;
  
  return 30;
};

const calculateInterestsMatch = (interests: string[], requirements: string[]): number => {
  if (requirements.length === 0) return 70;
  
  const matchingInterests = interests.filter(interest =>
    requirements.some(req => req.toLowerCase().includes(interest.toLowerCase()))
  );
  
  return Math.min(100, (matchingInterests.length / Math.max(interests.length, 1)) * 100 + 20);
};

const calculateExperienceMatch = (experience: string): number => {
  const expLower = experience.toLowerCase();
  if (expLower.includes('intern') || expLower.includes('project') || expLower.includes('work')) {
    return 85;
  }
  if (expLower.includes('none') || expLower.length < 50) {
    return 50;
  }
  return 70;
};

const calculateGpaScore = (gpa: number): number => {
  if (gpa >= 3.7) return 100;
  if (gpa >= 3.5) return 90;
  if (gpa >= 3.0) return 75;
  if (gpa >= 2.5) return 60;
  return 40;
};

export const getTopMatches = (student: Student, internships: Internship[], limit: number = 10): Match[] => {
  const matches = internships
    .map(internship => calculateMatchScore(student, internship))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return matches;
};