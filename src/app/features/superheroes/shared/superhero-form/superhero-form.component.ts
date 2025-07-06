import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuperHero, UniverseHero } from '@interfaces/superhero.interface';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'superhero-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './superhero-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroFormComponent {

  hero = input<SuperHero | undefined>(undefined);
  formSubmit = output<Partial<SuperHero>>();
  cancel = output<void>();

  fb = inject(FormBuilder);
  universes = signal<UniverseHero[]>(['Marvel', 'DC', 'Other']);

  heroForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    realName: [''],
    universe: ['', Validators.required],
    powers: ['', Validators.required],
    weaknesses: [''],
  });

  constructor() {

    // Reacción a cambios en el input hero
    effect(() => {
      const currentHero = this.hero();
      if (currentHero) {
        this.heroForm.patchValue({
          name: currentHero.name,
          realName: currentHero.realName ?? '',
          universe: currentHero.universe,
          powers: currentHero.powers.join(', '),
          weaknesses: currentHero.weaknesses?.join(', ') ?? '',
        });
      }
    });
  }

  onSubmit() {
    if (this.heroForm.valid) {
      const formValue = this.heroForm.value;
      const heroData: Partial<SuperHero> = {
        name: formValue.name ?? undefined,
        realName: formValue.realName || undefined,
        universe: formValue.universe as UniverseHero | undefined,
        powers: formValue.powers?.split(',').map(p => p.trim()).filter(Boolean) || [],
        weaknesses: formValue.weaknesses?.split(',').map(p => p.trim()).filter(Boolean),
      };

      this.formSubmit.emit(heroData);
    }
  }
  onCancel(): void {
    this.cancel.emit();
  }
}
