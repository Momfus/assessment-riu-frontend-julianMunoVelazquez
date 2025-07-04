import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SuperheroApiService } from './superhero-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuperHero } from '@interfaces/superhero.interface';
import { startWith, Subject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuperheroDataService {
  private api = inject(SuperheroApiService);

  private refresh$ = new Subject<void>();

  // Paginación
  pagination = signal({
    pageIndex: 0,
    pageSize: 10,
    totalItems: 0,
  });

  allHeroes = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.api.getAll())
    ),
    { initialValue: [] }
  );

  paginatedHeroes = computed(() => {
    const { pageIndex, pageSize } = this.pagination();
    const items = this.allHeroes();

    const start = pageIndex * pageSize;
    const newValue = items.slice(
      start,
      Math.min(start + pageSize, items.length)
    );
    console.log(pageIndex);

    return newValue;
  });

  constructor() {

    effect(() => {
      const total = this.allHeroes().length;
      this.pagination.update((prev) => {
        return prev.totalItems !== total ? { ...prev, totalItems: total } : prev;
      });
    });

  }

  create(hero: Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.api.create(hero).pipe(tap(() => this.refreshData()));
  }

  refreshData() {
    this.refresh$.next();
  }

  // Paginación
  setPageIndex(pageIndex: number): void {
    this.pagination.update((prev) => {
      const newIndex = Math.max(0, Math.min(pageIndex, this.totalPages() - 1));
      console.log('Updating pageIndex:', { old: prev.pageIndex, new: newIndex }); // Debug
      return { ...prev, pageIndex: newIndex };
    });
  }

  setPageSize(pageSize: number) {
    this.pagination.update((prev) => {
      const totalPages = Math.ceil(prev.totalItems / pageSize) || 1;

      const newIndex = Math.min(prev.pageIndex, totalPages - 1);
      return {
        ...prev,
        pageSize,
        pageIndex: newIndex
      };
    });
  }

  totalPages(): number {
    const { totalItems, pageSize } = this.pagination();
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }

  // getters
  get isLoading() {
    return this.api.isLoading();
  }
}
