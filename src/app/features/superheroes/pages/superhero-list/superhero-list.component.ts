import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-superhero-list',
  imports: [],
  templateUrl: './superhero-list.component.html',
  styleUrl: './superhero-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroListComponent { }
