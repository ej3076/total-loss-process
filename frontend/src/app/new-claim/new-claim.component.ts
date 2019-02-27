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
  color = new FormControl('', [Validators.required]);
  model = new FormControl('', [Validators.required]);
  vin = new FormControl('', [Validators.required, Validators.minLength(11)]);

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
        color: this.color.value,
        model: this.model.value,
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
    return this.vin.untouched || this.color.untouched || this.model.untouched;
  }

  hasErroredFields(): boolean {
    return (
      this.vin.hasError('minlength') ||
      this.vin.hasError('required') ||
      this.color.hasError('required') ||
      this.model.hasError('required')
    );
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
