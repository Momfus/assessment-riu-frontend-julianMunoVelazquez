import { inject, Injectable } from '@angular/core';
import { SuperheroApiService } from './superhero-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuperHero } from '@interfaces/superhero.interface';

@Injectable({
  providedIn: 'root'
})
export class SuperheroDataService {

  private api = inject(SuperheroApiService);

  allHeroes = toSignal(this.api.getAll(), { initialValue: []});

  create(hero: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.api.create(hero); // Delega la operación al apiService
  }

}
