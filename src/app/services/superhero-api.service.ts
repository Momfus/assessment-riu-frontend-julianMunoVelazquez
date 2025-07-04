import { inject, Injectable, signal } from '@angular/core';
import { SuperheroStorageService } from './superhero-storage.service';
import { delay, Observable, of, tap } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';

@Injectable({
  providedIn: 'root'
})
export class SuperheroApiService {

  isLoading = signal(false);
  lastError = signal<string | null>(null);

  private storage = inject(SuperheroStorageService);

  // Obtener todos los supeheroes
  getAll() {
    this.isLoading.set(true);
    this.lastError.set(null);

    this._startRequest();
    return of(this.storage.getAll()()).pipe(
      delay( this._generateRandomDelay() ),
      this._finalizeRequest()
    )
  }

  // Crear un super heroe
  create( hero: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>) {
    this._startRequest();

    const newHero: SuperHero = {
      ...hero,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentHeroes = this.storage.getAll()();
    this.storage.saveAll([...currentHeroes, newHero]);
    return of(newHero).pipe(
      delay( this._generateRandomDelay() ),
      this._finalizeRequest()
    )
  }

  private _startRequest() {
    this.isLoading.set(true);
    this.lastError.set(null);
  }

  private _finalizeRequest<T>() {
    return (source: Observable<T> ) => {
      return source.pipe(
        tap({
          next: () => this.isLoading.set(false),
          error: (error) => {
            this.isLoading.set(false);
            this.lastError.set(error.message || 'An error occurred');
          }
        })
      )
    }
  }

  private _generateRandomDelay() {
    return Math.random() * 1000 + 500; // Simular retraso en la respuesta (no estaria en caso de usar un api real)
  }

}
