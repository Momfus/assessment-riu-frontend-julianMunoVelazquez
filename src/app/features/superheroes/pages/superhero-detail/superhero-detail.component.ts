import { DatePipe, Location , UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperheroApiService } from '@services/superhero-api.service';
import { switchMap } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-superhero-detail',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    UpperCasePipe
  ],
  templateUrl: './superhero-detail.component.html',
  styleUrl: './superhero-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroDetailComponent {
  private api = inject(SuperheroApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  spinnerService = inject(SpinnerService);

  hero = toSignal(
    this.route.params.pipe(
      switchMap(params => this.api.getById(params['id']))
    )
  );

  goBack() {
    const currentState = this.location.getState() as any;

    if (currentState?.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/heroes'], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  getUniverseColor(universe: string): string {
    switch(universe) {
      case 'DC': return 'bg-blue-500 text-white';
      case 'Marvel': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}
