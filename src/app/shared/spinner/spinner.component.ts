import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    @if (spinnerService.isLoading() ){
      <div class="overlay flex flex-col justify-center">
        <p class="mb-4 font-bold">Loading...</p>
        <div class="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    }
  `,
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  spinnerService = inject(SpinnerService)
}
