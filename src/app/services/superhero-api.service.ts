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

  getAll(): Observable<SuperHero[]> {
    return this.http.get<SuperHero[]>(`${this.MOCK_PREFIX}/heroes`);
  }

  create(hero: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>): Observable<SuperHero> {
    return this.http.post<SuperHero>(`${this.MOCK_PREFIX}/heroes`, hero);
  }

  update(hero: SuperHero): Observable<SuperHero> {
    return this.http.put<SuperHero>(`${this.MOCK_PREFIX}/heroes/${hero.id}`, hero);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.MOCK_PREFIX}/heroes/${id}`);
  }

  getById(id: string): Observable<SuperHero> {
    return this.http.get<SuperHero>(`${this.MOCK_PREFIX}/heroes/${id}`);
  }


}
