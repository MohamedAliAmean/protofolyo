export type EducationItem = {
  school: string;
  detail: string;
  period: string;
};

export type ProfileData = {
  name: string;
  fullName: string;
  title: string;
  stackLine: string;
  location: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  summary: string;
  shortPitch: string;
  profileImageUrl: string;
  education: EducationItem[];
};

export type ExperienceItem = {
  id?: string;
  company: string;
  role: string;
  period: string;
  location: string;
  stack: string;
  points: string[];
  sortOrder?: number;
};

export type ProjectItem = {
  id?: string;
  title: string;
  period: string;
  stack: string[];
  description: string;
  href?: string | null;
  sortOrder?: number;
};

export type SkillGroup = {
  id?: string;
  title: string;
  items: string[];
  sortOrder?: number;
};

export type VisitorRecord = {
  id: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  user_agent: string | null;
  visited_at: string;
};

export type PortfolioData = {
  profile: ProfileData;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillGroups: SkillGroup[];
};

export type DbProfile = {
  id: number;
  full_name: string;
  title: string;
  stack_line: string;
  location: string;
  summary: string;
  short_pitch: string;
  email: string;
  phone: string;
  linkedin: string | null;
  github: string | null;
  whatsapp: string | null;
  profile_image_url: string | null;
  education: EducationItem[] | null;
};

export type DbExperience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  stack: string;
  points: string[];
  sort_order: number;
};

export type DbProject = {
  id: string;
  title: string;
  period: string;
  stack: string[];
  description: string;
  href: string | null;
  sort_order: number;
};

export type DbSkillGroup = {
  id: string;
  title: string;
  items: string[];
  sort_order: number;
};
