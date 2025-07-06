import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UniverseHero } from '@interfaces/superhero.interface';
import { SuperheroDataService } from '@services/superhero-data.service';
import { SuperheroModalFormComponent } from '../superhero-modal-form/superhero-modal-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'superhero-navbar',
  imports: [MatToolbarModule, MatButtonModule],
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }

      .custom-toolbar {
        background-color: #810081;
        color: white;
      }
    `,
  ],
  template: `
    <mat-toolbar class="custom-toolbar">
      <span class="ml-4">Hero List</span>
      <span class="spacer"></span>
      <button matButton="filled" (click)="createHero()">Add Hero</button>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroNavbarComponent {
  private dataService = inject(SuperheroDataService);
  private dialog = inject(MatDialog);

  createHero() {
    this.dialog.open(SuperheroModalFormComponent, {
      width: '500px',
      data: {
        hero: undefined,
      }
    });
  }

  testCreation() {
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
}
