export interface Instructor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  stats?: {
    courses: number;
    articles: number;
    students: number;
  };
  expertise: string[];
  linkedin?: string;
  website?: string;
  medium?: string;
}