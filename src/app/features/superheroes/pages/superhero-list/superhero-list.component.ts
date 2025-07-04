import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { SuperheroDataService } from '@services/superhero-data.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { UniverseHero } from '@interfaces/superhero.interface';
@Component({
  selector: 'app-superhero-list',
  imports: [],
  templateUrl: './superhero-list.component.html',
  styleUrl: './superhero-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroListComponent implements OnInit {

  dataService = inject(SuperheroDataService);

  heroesResource = rxResource({
    params: () => ({}),
    stream: () => {
      return new Observable(subscriber => {
        const value = this.dataService.allHeroes();
        console.log(value);

        subscriber.next(value);

        const effectRef = effect(() => {
          subscriber.next(this.dataService.allHeroes());
        });

        return () => effectRef.destroy();
      });
    }
  });


  ngOnInit() {
    setTimeout(() => this.createTestHero(), 1000); // @TODO: Test temporal
  }

  createTestHero() {
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
      },
      error: (err) => console.error('Error al crear héroe:', err),
    });
  }

}
