import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <mat-card class="p-8 text-center shadow-lg">
        <mat-card-title class="text-2xl font-bold text-red-600">404 - Page Not Found</mat-card-title>
        <mat-card-content>
          <p class="text-wite-700 mb-4">The page you are looking for does not exist.</p>
          <button mat-raised-button class="cursor-pointer" color="primary" (click)="goHome()">Go to Home</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {

  private router = inject(Router);

  goHome() {
    this.router.navigate(['']);
  }
}
