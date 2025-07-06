import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SuperheroModalFormComponent } from '../superhero-modal-form/superhero-modal-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
      <button class="ml-4 cursor-pointer font-bold" (click)="goHome()">Hero List</button>
      <span class="spacer"></span>
      @if( isBaseRoute ) {
        <button matButton="filled" (click)="createHero()">Add Hero</button>
      }
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroNavbarComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  createHero() {
    this.dialog.open(SuperheroModalFormComponent, {
      width: '500px',
      disableClose: true,
      data: {
        hero: undefined,
      }
    });
  }

  goHome() {
    this.router.navigate(['']);
  }

  get isBaseRoute(): boolean {
    const urlTree = this.router.parseUrl(this.router.url);
    return urlTree.root.children['primary']?.segments.length === 1 &&
           urlTree.root.children['primary'].segments[0].path === 'heroes';
  }

}
