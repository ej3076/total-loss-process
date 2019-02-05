import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../models/Vehicle';
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

  private setVehicle() {
    let vehicle: Vehicle = {
      vin: this.vin.value,
      model: this.model.value,
      color: this.color.value,
      status: 0,
    };

    console.log(vehicle);

    let test = this.middlewareService.addClaim(vehicle);

    console.log(test);
  }

  sendNewVehicle() {
    this.setVehicle();
  }
}
