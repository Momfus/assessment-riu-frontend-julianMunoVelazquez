import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-superhero-modal-confirm',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>
        Confirm
      </button>
    </mat-dialog-actions>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroModalConfirmComponent {
  private readonly dialogRef = inject(
    MatDialogRef<SuperheroModalConfirmComponent>
  );

  readonly data = inject<{ title: string; message:string }>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }
}
