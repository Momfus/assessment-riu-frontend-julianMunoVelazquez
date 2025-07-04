import { Injectable, Signal, signal } from '@angular/core';
import { SuperHero } from '@interfaces/superhero.interface';

// NOTA: Este servicio es para simular una base de datos local con localStorage

@Injectable({
  providedIn: 'root'
})
export class SuperheroStorageService {

  private readonly STORAGE_KEY = 'superheroes';

  private data = signal<SuperHero[]>(this.loadFromStorage() );

  private loadFromStorage(): SuperHero[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(data: SuperHero[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getAll(): Signal<SuperHero[]> {
    return this.data;
  }

  getById(id: string): SuperHero | undefined {
    return this.data().find(h => h.id === id);
  }

  saveAll( heroes: SuperHero[]): void {
    this.data.set(heroes);
    this.saveToStorage(heroes);
  }

}
