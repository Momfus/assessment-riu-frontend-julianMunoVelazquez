import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UniverseHero } from '@interfaces/superhero.interface';
import { SuperheroDataService } from '@services/superhero-data.service';

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
  templateUrl: './superhero-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroNavbarComponent {

  private dataService = inject(SuperheroDataService);

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


}
