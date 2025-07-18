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
import { MatDialog } from '@angular/material/dialog';
import { SuperheroModalFormComponent } from '@superheroes/shared/superhero-modal-form/superhero-modal-form.component';
import { SuperheroModalConfirmComponent } from '@superheroes/shared/superhero-modal-confirm/superhero-modal-confirm.component';
import { UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SuperheroFilterListComponent } from './superhero-filter-list/superhero-filter-list.component';

@Component({
  selector: 'app-superhero-list',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    UpperCasePipe,
    ReactiveFormsModule,
    SuperheroFilterListComponent
  ],
  templateUrl: './superhero-list.component.html',
  styleUrl: './superhero-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroListComponent implements OnInit {
  private dialog = inject(MatDialog);

  dataService = inject(SuperheroDataService);
  spinnerService = inject(SpinnerService);
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
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] ? Number(params['page']) - 1 : 0;
      const pageSize = params['pageSize'] ? Number(params['pageSize']) : 10;
      this.dataService.setPageIndex(page);
      this.dataService.setPageSize(pageSize);

      if (params['search']) {
        this.dataService.searchHeroes(params['search']);
      }

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

  onSearchChange(term: string) {
    if (term) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: term, page: 1 },
        queryParamsHandling: 'merge'
      });
      this.dataService.searchHeroes(term);
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: 'merge'
      });
      this.dataService.clearSearch();
    }
  }

  editHero(hero: SuperHero) {
    const dialogRef = this.dialog.open(SuperheroModalFormComponent, {
      width: '500px',
      data: { hero },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.refreshData();
      }
    });
  }

  deleteHero(hero: SuperHero) {
    const dialogRef = this.dialog.open(SuperheroModalConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${hero.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.delete(hero.id).subscribe(() => {
          this.dataService.refreshData();
        });
      }
    });
  }

  navigateToDetail(hero: SuperHero, event: MouseEvent) {

    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    this.router.navigate(['hero', hero.id], { relativeTo: this.route });
  }
}
