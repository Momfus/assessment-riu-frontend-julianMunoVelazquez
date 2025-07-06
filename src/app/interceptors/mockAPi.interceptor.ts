import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SuperheroStorageService } from '@services/superhero-storage.service';
import { delay, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { SuperHero } from '@interfaces/superhero.interface';

// NOTA: Este interceptor simula una API REST para los superhéroes ( es para que pueda funcionar el otro interceptor de spinner)
export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(SuperheroStorageService);

  if (!req.url.includes('/api-mock')) {
    return next(req);
  }

  const mockDelay = Math.random() * 1000 + 500;

  if (req.method === 'GET' && req.url.endsWith('/heroes')) {
    const heroes = storage.getAll()();
    return of(
      new HttpResponse({
        status: 200,
        body: heroes,
      })
    ).pipe(delay(mockDelay));
  }

  if (req.method === 'POST' && req.url.endsWith('/heroes')) {
    const heroData = req.body as Omit<
      SuperHero,
      'id' | 'createdAt' | 'updatedAt'
    >;

    const newHero: SuperHero = {
      ...heroData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const currentHeroes = storage.getAll()();
    storage.saveAll([...currentHeroes, newHero]);

    return of(
      new HttpResponse({
        status: 201,
        body: newHero,
      })
    ).pipe(delay(mockDelay));
  }

  return next(req);
};
