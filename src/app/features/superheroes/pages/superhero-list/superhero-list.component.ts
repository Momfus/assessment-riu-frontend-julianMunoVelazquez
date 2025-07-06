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
import { SuperHero } from '@interfaces/superhero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-superhero-list',
  imports: [
    MatPaginatorModule,
    MatTableModule,
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
  spinnerSerrvice = inject(SpinnerService);
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

  editHero(hero: SuperHero) {
    //@TODO. implementar logica de edicion
    console.log('Editar héroe:', hero);
  }

  deleteHero(heroId: String) {
    //@TODO. implementar logica de borrado
    console.log('Borrar héroe con ID:', heroId);
  }
}
