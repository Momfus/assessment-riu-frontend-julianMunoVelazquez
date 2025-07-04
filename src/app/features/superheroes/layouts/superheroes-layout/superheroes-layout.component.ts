import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-superheroes-layout',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
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
  createHero() {
    console.log('Create Hero');
  }
}
