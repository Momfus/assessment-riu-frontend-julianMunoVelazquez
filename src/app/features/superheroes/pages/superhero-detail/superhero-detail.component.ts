import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-superhero-detail',
  imports: [],
  templateUrl: './superhero-detail.component.html',
  styleUrl: './superhero-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroDetailComponent { }
