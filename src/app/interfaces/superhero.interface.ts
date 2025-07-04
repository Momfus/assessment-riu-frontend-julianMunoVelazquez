
export type UniverseHero = 'DC' | 'Marvel' | 'Other';

export interface SuperHero {
  id: string;
  name: string;
  realName?: string;
  universe: UniverseHero;
  powers: string[];
  weaknesses?: string[];
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
