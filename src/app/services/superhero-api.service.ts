import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuperheroApiService {

  private http = inject(HttpClient);

  private readonly MOCK_PREFIX = '/api-mock';


  // Obtener todos los supeheroes
  getAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(`${this.MOCK_PREFIX}/heroes`);
  }

  // Crear un super heroe
  create(hero: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>): Observable<SuperHero> {
    return this.http.post<SuperHero>(`${this.MOCK_PREFIX}/heroes`, hero);
  }



}
