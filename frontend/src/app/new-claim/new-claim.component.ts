import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
export class NewClaimComponent implements OnInit {
  appearance = new FormControl();

  vin = new FormControl('', [Validators.required, Validators.minLength(11)]);
  model = new FormControl('', [Validators.required]);
  color = new FormControl('', [Validators.required]);
  readonly classes = this._theme.addStyleSheet(STYLES);

  constructor(
    private _theme: LyTheme2,
    private middlewareService: MiddlewareService,
  ) {
    this.appearance.setValue('outlined');
  }

  ngOnInit() {}

  private setClaim() {
    const claim: DeepPartial<Protos.Claim> = {
      vehicle: {
        vin: this.vin.value,
        color: this.color.value,
        model: this.model.value,
      },
    };
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

  checkIfSpecialChar(event) {
    var eventCode;
    eventCode = event.charCode;

    // Only allow letters and numbers to be input.
    return (
      (eventCode > 64 && eventCode < 91) ||
      (eventCode > 96 && eventCode < 123) ||
      eventCode == 8 ||
      eventCode == 9 ||
      eventCode == 32 ||
      (eventCode >= 48 && eventCode <= 57)
    );
  }
}
