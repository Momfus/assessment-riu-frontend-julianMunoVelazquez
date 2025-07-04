import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-superhero-card',
  imports: [],
  templateUrl: './superhero-card.component.html',
  styleUrl: './superhero-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroCardComponent { }
