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
  spin = inject(SpinnerService)
  private readonly dialogRef = inject(
    MatDialogRef<SuperheroModalFormComponent>
  );
  private readonly dataService = inject(SuperheroDataService);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = inject<{ hero?: SuperHero }>(MAT_DIALOG_DATA);

  onFormSubmit(heroData: Partial<SuperHero>) {

    // Esto es para asegurarme los campos requeridos
    const safeData = {
      ...heroData,
      name: heroData.name!,
      universe: heroData.universe!,
      powers: heroData.powers!
    } as Omit<SuperHero, 'id' | 'createdAt' | 'updatedAt'>;

    if (this.data?.hero) {
      // Edición
      console.log('Edición de héroe:', heroData);

    } else {

      this.dataService.create(safeData).subscribe(() => {
        this.dataService.refreshData();
        this.dialogRef.close();
      });

    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
