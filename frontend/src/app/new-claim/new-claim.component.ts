import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LyTheme2 } from '@alyle/ui';
import { MiddlewareService } from '../middleware/middleware.service';

const STYLES = () => ({
  labelBefore: {
    paddingAfter: '8px',
  },
});

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewClaimComponent {
  readonly classes = this._theme.addStyleSheet(STYLES);

  appearance = new FormControl();
  vin = new FormControl('', [Validators.required, Validators.minLength(11)]);
  model = new FormControl('', [Validators.required]);
  year = new FormControl('', [Validators.required, Validators.minLength(4)]);
  acv = new FormControl('');
  miles = new FormControl('');
  color = new FormControl('');

  constructor(
    private _theme: LyTheme2,
    private middlewareService: MiddlewareService,
  ) {
    this.appearance.setValue('outlined');
  }

  private setClaim() {
    const claim = {
      vehicle: {
        vin: this.vin.value,
        model: this.model.value,
        // acv: this.acv.value,
        // year: this.year.value,
        // miles: this.miles.value,
        color: this.color.value,
      },
    };

    // FIXME: Remove this
    console.log(this.middlewareService.addClaim(claim));
  }

  sendNewClaim() {
    this.setClaim();
  }

  hasEmptyFields(): boolean {
    return this.areFieldsUntouched() || this.hasErroredFields();
  }

  areFieldsUntouched(): boolean {
    return !(this.vin.value && this.model.value && this.year.value);
  }

  hasErroredFields(): boolean {
    return (
      this.vin.hasError('minlength') ||
      this.vin.hasError('required') ||
      this.year.hasError('minlength') ||
      this.year.hasError('required') ||
      this.model.hasError('required')
    );
  }

  public numberValidator(event: any) {
    const charactersAllowed = /^[0-9]*$/;

    if (!charactersAllowed.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
  }

  public alphaNumericValidator(event: any) {
    const charactersAllowed = /^[a-zA-Z0-9]*$/;

    // If the value inputted does not match anything
    // in the defined pattern, replace with nothing.
    if (!charactersAllowed.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
    }
  }
}
