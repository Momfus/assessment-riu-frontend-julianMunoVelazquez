import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperheroNavbarComponent } from '@superheroes/shared/superhero-navbar/superhero-navbar.component';

@Component({
  selector: 'app-superheroes-layout',
  imports: [RouterOutlet, SuperheroNavbarComponent],
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
  templateUrl: './superheroes-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesLayoutComponent {

}
