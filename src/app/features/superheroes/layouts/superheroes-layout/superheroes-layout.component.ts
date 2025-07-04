import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-superheroes-layout',
  imports: [RouterOutlet],
  templateUrl: './superheroes-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesLayoutComponent { }
