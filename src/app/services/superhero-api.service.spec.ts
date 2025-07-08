import { TestBed } from '@angular/core/testing';
import { SuperheroApiService } from './superhero-api.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';

const MOCK_HEROES: SuperHero[] = [
  { id: '1', name: 'Superman', universe: 'DC', powers: ['flight'], weaknesses: ['kryptonite'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Spiderman', universe: 'Marvel', powers: ['spider-sense'], weaknesses: ['ethanol'], createdAt: new Date(), updatedAt: new Date() },
];

const MOCK_HERO: SuperHero = {
  id: '1',
  name: 'Batman',
  universe: 'DC',
  powers: ['intelligence'],
  weaknesses: ['none'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const NEW_HERO_DATA = {
  name: 'Ironman',
  universe: 'Marvel' as const,
  powers: ['tech'],
  weaknesses: ['alcohol'],
};

describe('SuperheroApiService', () => {
  let service: SuperheroApiService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        SuperheroApiService,
        { provide: HttpClient, useValue: httpSpy },
      ],
    });
    service = TestBed.inject(SuperheroApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all heroes', (done) => {
      httpSpy.get.and.returnValue(of(MOCK_HEROES));

      service.getAll().subscribe({
        next: (heroes) => {
          expect(heroes).toEqual(MOCK_HEROES);
          expect(httpSpy.get).toHaveBeenCalledWith('/api-mock/heroes');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when getting all heroes', (done) => {
      const errorMessage = 'Failed to fetch heroes';
      httpSpy.get.and.returnValue(throwError(() => new Error(errorMessage)));

      service.getAll().subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new hero', (done) => {
      const createdHero = { ...MOCK_HERO, ...NEW_HERO_DATA };
      httpSpy.post.and.returnValue(of(createdHero));

      service.create(NEW_HERO_DATA).subscribe({
        next: (hero) => {
          expect(hero).toEqual(createdHero);
          expect(httpSpy.post).toHaveBeenCalledWith('/api-mock/heroes', NEW_HERO_DATA);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when creating hero', (done) => {
      const errorMessage = 'Failed to create hero';
      httpSpy.post.and.returnValue(throwError(() => new Error(errorMessage)));

      service.create(NEW_HERO_DATA).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing hero', (done) => {
      const updatedHero = { ...MOCK_HERO, name: 'Updated Batman' };
      httpSpy.put.and.returnValue(of(updatedHero));

      service.update(updatedHero).subscribe({
        next: (hero) => {
          expect(hero).toEqual(updatedHero);
          expect(httpSpy.put).toHaveBeenCalledWith(`/api-mock/heroes/${updatedHero.id}`, updatedHero);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when updating hero', (done) => {
      const errorMessage = 'Failed to update hero';
      httpSpy.put.and.returnValue(throwError(() => new Error(errorMessage)));

      service.update(MOCK_HERO).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a hero', (done) => {
      httpSpy.delete.and.returnValue(of(void 0));

      service.delete('1').subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
          expect(httpSpy.delete).toHaveBeenCalledWith('/api-mock/heroes/1');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when deleting hero', (done) => {
      const errorMessage = 'Failed to delete hero';
      httpSpy.delete.and.returnValue(throwError(() => new Error(errorMessage)));

      service.delete('1').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('getById', () => {
    it('should return a hero by id', (done) => {
      httpSpy.get.and.returnValue(of(MOCK_HERO));

      service.getById('1').subscribe({
        next: (hero) => {
          expect(hero).toEqual(MOCK_HERO);
          expect(httpSpy.get).toHaveBeenCalledWith('/api-mock/heroes/1');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when getting hero by id', (done) => {
      const errorMessage = 'Hero not found';
      httpSpy.get.and.returnValue(throwError(() => new Error(errorMessage)));

      service.getById('999').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });

  describe('search', () => {
    it('should search heroes by term', (done) => {
      const searchResults = [MOCK_HEROES[1]]; // Spiderman
      httpSpy.get.and.returnValue(of(searchResults));

      service.search('spider').subscribe({
        next: (heroes) => {
          expect(heroes).toEqual(searchResults);
          expect(httpSpy.get).toHaveBeenCalledWith('/api-mock/heroes?name_like=spider');
          done();
        },
        error: done.fail,
      });
    });

    it('should handle error when searching heroes', (done) => {
      const errorMessage = 'Search failed';
      httpSpy.get.and.returnValue(throwError(() => new Error(errorMessage)));

      service.search('invalid').subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });

    it('should search with empty term', (done) => {
      httpSpy.get.and.returnValue(of([]));

      service.search('').subscribe({
        next: (heroes) => {
          expect(heroes).toEqual([]);
          expect(httpSpy.get).toHaveBeenCalledWith('/api-mock/heroes?name_like=');
          done();
        },
        error: done.fail,
      });
    });
  });
});
