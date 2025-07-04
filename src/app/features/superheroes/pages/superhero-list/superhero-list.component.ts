import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { SuperheroDataService } from '@services/superhero-data.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { SuperHero, UniverseHero } from '@interfaces/superhero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-superhero-list',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinner,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './superhero-list.component.html',
  styleUrl: './superhero-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroListComponent implements OnInit {
  dataService = inject(SuperheroDataService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  displayedColumns = ['name', 'publisher', 'actions'];

  heroesResource = rxResource({
    params: () => ({}),
    stream: () => {
      return new Observable((subscriber) => {
        const value = this.dataService.paginatedHeroes();

        subscriber.next(value);

        const effectRef = effect(() => {
          subscriber.next(this.dataService.paginatedHeroes());
        });

        return () => effectRef.destroy();
      });
    },
  });

  ngOnInit() {
    // setTimeout(() => this.createHero(), 1000); // @TODO: Test temporal

    // Chequea con los queryParams de la ruta actual
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] ? Number(params['page']) - 1 : 0;
      const pageSize = params['pageSize'] ? Number(params['pageSize']) : 10;
      this.dataService.setPageIndex(page);
      this.dataService.setPageSize(pageSize);
    });
  }

  onPageChange(event: PageEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: event.pageIndex + 1,
        pageSize: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  //@TODO: Mover a otro componente para separar de la paginación
  createHero() {
    const testHero = {
      name: 'IronMan-' + Math.floor(Math.random() * 1000),
      power: 'Tecnología',
      age: 48,
      universe: 'Marvel' as UniverseHero,
      powers: ['Alta tecnología'],
    };

    this.dataService.create(testHero).subscribe({
      next: (newHero) => {
        console.log('Héroe creado:', newHero);
        const value = this.dataService.allHeroes();
        console.log(value);
      },
      error: (err) => console.error('Error al crear héroe:', err),
    });
  }

  editHero(hero: SuperHero) {
    //@TODO. implementar logica de edicion
    console.log('Editar héroe:', hero);
  }

  deleteHero(heroId: String) {
    //@TODO. implementar logica de borrado
    console.log('Borrar héroe con ID:', heroId);
  }
}
