import { User, Job } from '@/types';

export interface AIMatchResult {
  score: number;
  reasons: string[];
}

export function calculateAIMatch(student: User | null, job: Job): AIMatchResult {
  if (!student || !student.skills || student.skills.length === 0) {
    return {
      score: 0,
      reasons: ['Set up your skills in Profile to calculate AI match percentage']
    };
  }

  let score = 20; // Base score for registered student
  const reasons: string[] = [];

  // Skill Matching (Up to 50% weight)
  if (student.skills && student.skills.length > 0 && job.skillsRequired.length > 0) {
    const studentSkillsLower = student.skills.map(s => s.toLowerCase().trim());
    const matchedSkills = job.skillsRequired.filter(s =>
      studentSkillsLower.some(sk => sk.includes(s.toLowerCase().trim()) || s.toLowerCase().trim().includes(sk))
    );

    const matchRatio = matchedSkills.length / job.skillsRequired.length;
    score += Math.round(matchRatio * 50);

    if (matchedSkills.length > 0) {
      reasons.push(`Matches ${matchedSkills.slice(0, 3).join(', ')} skills`);
    }
  }

  // Department Matching (Up to 20% weight)
  if (student.department && job.department) {
    if (student.department.toLowerCase().includes(job.department.toLowerCase()) || job.department.toLowerCase().includes(student.department.toLowerCase())) {
      score += 20;
      reasons.push(`Matches ${job.department} department focus`);
    } else if (
      (student.department.includes('Computer Science') && job.skillsRequired.some(s => ['React', 'JavaScript', 'Python', 'MS Excel', 'Data Entry'].includes(s))) ||
      (student.department.includes('Business') && job.skillsRequired.some(s => ['Social Media', 'Communication', 'Marketing'].includes(s)))
    ) {
      score += 15;
      reasons.push(`Aligned academic background`);
    }
  }

  // Work Type & Location Matching (Up to 10% weight)
  if (job.workType === 'Remote') {
    score += 10;
    reasons.push('Remote flexibility matches student schedule');
  } else if (student.location && job.location && student.location.toLowerCase().includes(job.location.toLowerCase())) {
    score += 10;
    reasons.push('Convenient location match');
  }

  const finalScore = Math.min(99, Math.max(0, score));

  if (reasons.length === 0) {
    reasons.push('General suitability for campus student role');
  }

  return {
    score: finalScore,
    reasons,
  };
}
