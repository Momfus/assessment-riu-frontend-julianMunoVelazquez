import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { SuperheroFormComponent } from '../superhero-form/superhero-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SuperheroDataService } from '@services/superhero-data.service';
import { SuperHero } from '@interfaces/superhero.interface';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-superhero-modal-form',
  imports: [SuperheroFormComponent, MatDialogModule],
  template: ` <h2 mat-dialog-title>
      {{ data.hero ? 'Edit Hero' : 'Create New Hero' }}
    </h2>
    <mat-dialog-content>
      <superhero-form
        [hero]="data.hero"
        (formSubmit)="onFormSubmit($event)"
        (cancel)="onCancel()"
      >
      </superhero-form>
    </mat-dialog-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroModalFormComponent {
  private readonly dialogRef = inject(
    MatDialogRef<SuperheroModalFormComponent>
  );
  private readonly dataService = inject(SuperheroDataService);

  readonly data = inject<{ hero?: SuperHero }>(MAT_DIALOG_DATA);

  onFormSubmit(heroData: Partial<SuperHero>) {
    // Esto es para asegurarme los campos requeridos
    const safeData = {
      ...heroData,
      name: heroData.name!,
      universe: heroData.universe!,
      powers: heroData.powers!,
    } as Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>;

    if (this.data?.hero) {
      // Edición
      this.dataService
        .update({
          ...safeData,
          id: this.data.hero.id,
          updatedAt: new Date(),
        })
        .subscribe({
          next: () => this.successHeroEditCreate(),
          error: (error: Error) => {
            console.error('Error al editar héroe:', error);
          },
        });
    } else {
      // Creación
      this.dataService.create(safeData).subscribe({
        next: () => this.successHeroEditCreate(),
        error: (error: Error) => {
          console.error('Error al crear héroe:', error);
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private successHeroEditCreate() {
    this.dataService.refreshData();
    this.dialogRef.close();
  }
}
