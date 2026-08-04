import { User, Job } from '@/types';

export interface AIMatchResult {
  score: number;
  reasons: string[];
}

export function calculateAIMatch(student: User, job: Job): AIMatchResult {
  let score = 50; // Base score
  const reasons: string[] = [];

  // Skill Matching (30% weight)
  if (student.skills && student.skills.length > 0 && job.skillsRequired.length > 0) {
    const studentSkillsLower = student.skills.map(s => s.toLowerCase());
    const matchedSkills = job.skillsRequired.filter(s =>
      studentSkillsLower.includes(s.toLowerCase())
    );

    const matchRatio = matchedSkills.length / job.skillsRequired.length;
    score += Math.round(matchRatio * 30);

    if (matchedSkills.length > 0) {
      reasons.push(`Matches ${matchedSkills.slice(0, 3).join(', ')} skills`);
    }
  }

  // Department Matching (15% weight)
  if (student.department && job.department) {
    if (student.department.toLowerCase() === job.department.toLowerCase()) {
      score += 15;
      reasons.push(`Matches ${job.department} department focus`);
    } else if (
      (student.department.includes('Computer Science') && job.skillsRequired.some(s => ['React', 'JavaScript', 'Python'].includes(s))) ||
      (student.department.includes('Business') && job.skillsRequired.some(s => ['Social Media', 'Communication', 'Event'].includes(s)))
    ) {
      score += 10;
      reasons.push(`Highly aligned department background`);
    }
  }

  // Work Type & Location Matching (10% weight)
  if (job.workType === 'Remote') {
    score += 8;
    reasons.push('Remote flexibility matches student schedule');
  } else if (student.location && job.location && student.location.toLowerCase().includes('campus')) {
    score += 7;
    reasons.push('Convenient on-campus location');
  }

  // Student Rating Boost (5% weight)
  if (student.rating && student.rating >= 4.8) {
    score += 5;
    reasons.push('High student performance rating');
  }

  // Cap score between 65 and 99
  const finalScore = Math.min(99, Math.max(65, score));

  if (reasons.length === 0) {
    reasons.push('General suitability for campus student role');
  }

  return {
    score: finalScore,
    reasons,
  };
}
