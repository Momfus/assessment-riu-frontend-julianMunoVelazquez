import { TestBed } from '@angular/core/testing';
import { SuperheroStorageService } from './superhero-storage.service';
import { SuperHero } from '@interfaces/superhero.interface';

const HEROES: SuperHero[] = [
  { id: '1', name: 'Superman', universe: 'DC', powers: ['flight'], weaknesses: ['kryptonite'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Spiderman', universe: 'Marvel', powers: ['spider-sense'], weaknesses: ['ethanol'], createdAt: new Date(), updatedAt: new Date() },
];

describe('SuperheroStorageService', () => {
  let service: SuperheroStorageService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => localStorageMock[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { localStorageMock[key] = value; });
    TestBed.configureTestingModule({
      providers: [SuperheroStorageService],
    });
    service = TestBed.inject(SuperheroStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes as a signal', () => {
    service.saveAll(HEROES);
    expect(service.getAll()()).toEqual(HEROES);
  });

  it('should get hero by id', () => {
    service.saveAll(HEROES);
    const hero = service.getById('2');
    expect(hero).toEqual(HEROES[1]);
  });

  it('should return undefined for non-existent id', () => {
    service.saveAll(HEROES);
    const hero = service.getById('999');
    expect(hero).toBeUndefined();
  });

  it('should persist heroes to localStorage', () => {
    service.saveAll(HEROES);
    expect(localStorage.setItem).toHaveBeenCalledWith('superheroes', jasmine.any(String));
    expect(JSON.parse(localStorageMock['superheroes']).length).toBe(2);
  });

  it('should load heroes from localStorage on init', () => {
    localStorageMock['superheroes'] = JSON.stringify(HEROES);
    const newService = new SuperheroStorageService();
    expect(newService.getAll()().length).toBe(2);
  });
});
