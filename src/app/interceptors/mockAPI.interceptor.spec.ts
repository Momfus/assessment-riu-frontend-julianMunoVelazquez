import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mockHttpInterceptor } from './mockAPI.interceptor';
import { SuperheroStorageService } from '@services/superhero-storage.service';
import { SuperHero } from '@interfaces/superhero.interface';
import { signal } from '@angular/core';

describe('mockHttpInterceptor', () => {
  let storageSpy: jasmine.SpyObj<SuperheroStorageService>;
  let mockNext: jasmine.SpyObj<HttpHandlerFn>;

  const mockHeroes: SuperHero[] = [
    { id: '1', name: 'Superman', universe: 'DC', powers: ['flight'], weaknesses: ['kryptonite'], createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Spiderman', universe: 'Marvel', powers: ['spider-sense'], weaknesses: ['ethanol'], createdAt: new Date(), updatedAt: new Date() },
  ];

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('SuperheroStorageService', ['getAll', 'getById', 'saveAll']);
    storageSpy.getAll.and.returnValue(signal(mockHeroes));
    storageSpy.getById.and.returnValue(mockHeroes[0]);
    storageSpy.saveAll.and.stub();

    mockNext = jasmine.createSpy('next').and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: SuperheroStorageService, useValue: storageSpy },
      ],
    });
  });

    it('should pass through requests that do not include /api-mock', () => {
    const req = new HttpRequest('GET', 'https://api.example.com/data');

    TestBed.runInInjectionContext(() => {
      const interceptor = mockHttpInterceptor;
      interceptor(req, mockNext);
    });

    expect(mockNext).toHaveBeenCalledWith(req);
  });

  describe('GET /heroes', () => {
            it('should return all heroes for GET /api-mock/heroes', (done) => {
      const req = new HttpRequest('GET', '/api-mock/heroes');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero[]>).body).toEqual(mockHeroes);
          expect((response as HttpResponse<SuperHero[]>).status).toBe(200);
          done();
        });
      });
    });
  });

  describe('GET search', () => {
    it('should filter heroes by name when searching', (done) => {
      const req = new HttpRequest('GET', '/api-mock/heroes?name_like=super');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero[]>).body).toEqual([mockHeroes[0]]);
          expect((response as HttpResponse<SuperHero[]>).status).toBe(200);
          done();
        });
      });
    });

        it('should handle search with empty term', (done) => {
      const req = new HttpRequest('GET', '/api-mock/heroes?name_like=');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero[]>).body).toEqual(mockHeroes);
          expect((response as HttpResponse<SuperHero[]>).status).toBe(200);
          done();
        });
      });
    });

        it('should handle search with no name_like parameter', () => {
      const req = new HttpRequest('GET', '/api-mock/heroes?other=param');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext);

        expect(mockNext).toHaveBeenCalledWith(req);
      });
    });
  });

  describe('GET /heroes/:id', () => {
    it('should return hero when found', (done) => {
      const req = new HttpRequest('GET', '/api-mock/heroes/1');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero>).body).toEqual(mockHeroes[0]);
          expect((response as HttpResponse<SuperHero>).status).toBe(200);
          done();
        });
      });
    });

        it('should return 404 when hero not found', (done) => {
      storageSpy.getById.and.returnValue(undefined);
      const req = new HttpRequest('GET', '/api-mock/heroes/999');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero>).body).toBeNull();
          expect((response as HttpResponse<SuperHero>).status).toBe(404);
          done();
        });
      });
    });
  });

  describe('POST /heroes', () => {
    it('should create new hero', (done) => {
      const newHeroData = {
        name: 'Batman',
        universe: 'DC' as const,
        powers: ['intelligence'],
        weaknesses: ['none'],
      };
      const req = new HttpRequest('POST', '/api-mock/heroes', newHeroData);

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero>).status).toBe(201);
          expect((response as HttpResponse<SuperHero>).body!.name).toBe('Batman');
          expect((response as HttpResponse<SuperHero>).body!.id).toBeDefined();
          expect((response as HttpResponse<SuperHero>).body!.createdAt).toBeDefined();
          expect((response as HttpResponse<SuperHero>).body!.updatedAt).toBeDefined();
          expect(storageSpy.saveAll).toHaveBeenCalled();
          done();
        });
      });
    });
  });

    describe('PUT /heroes/:id', () => {
    it('should update existing hero', (done) => {
      const updatedHero = { ...mockHeroes[0], name: 'Updated Superman' };
      const req = new HttpRequest('PUT', '/api-mock/heroes/1', updatedHero);

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero>).status).toBe(200);
          expect((response as HttpResponse<SuperHero>).body!.name).toBe('Updated Superman');
          expect((response as HttpResponse<SuperHero>).body!.updatedAt).toBeDefined();
          expect(storageSpy.saveAll).toHaveBeenCalled();
          done();
        });
      });
    });

            it('should not update when hero not found', (done) => {
      const currentHeroes = storageSpy.getAll()();
      const updatedHero = { ...mockHeroes[0], id: '999', name: 'Updated Hero' };
      const req = new HttpRequest('PUT', '/api-mock/heroes/999', updatedHero);

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        const result = interceptor(req, mockNext);
        expect(result).toBeDefined();
        expect(storageSpy.saveAll).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('DELETE /heroes/:id', () => {
    it('should delete hero', (done) => {
      const req = new HttpRequest('DELETE', '/api-mock/heroes/1');

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext).subscribe((response: any) => {
          expect((response as HttpResponse<SuperHero>).status).toBe(204);
          expect(storageSpy.saveAll).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('Unhandled requests', () => {
    it('should pass through unhandled api-mock requests', () => {
      const req = new HttpRequest('POST', '/api-mock/other', {});

      TestBed.runInInjectionContext(() => {
        const interceptor = mockHttpInterceptor;
        interceptor(req, mockNext);
      });

      expect(mockNext).toHaveBeenCalledWith(req);
    });
  });
});
