
export interface SuperHero {
  id: string;
  name: string;
  realName?: string;
  universe: 'DC' | 'Marvel' | 'Other';
  powers: string[];
  weaknesses?: string[];
  avatar?: string;
  createat?: Date;
  updatedat?: Date;
}
