import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Vehicle } from '../models/vehicle';
import { LyTheme2 } from '@alyle/ui';

const STYLES = () => ({
  labelBefore: {
    paddingAfter: '8px'
  },
});

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewClaimComponent implements OnInit {
  appearance = new FormControl();

  vin = new FormControl('', [Validators.required, Validators.minLength(11)]);
  model = new FormControl('', [Validators.required]);
  color = new FormControl('', [Validators.required]);

  vehicle: Vehicle;

  readonly classes = this._theme.addStyleSheet(STYLES);
  
  constructor(private _theme: LyTheme2) {
      this.appearance.setValue('outlined');
   }

  ngOnInit() {
  }

  private setVehicle() {
    this.vehicle = {
      vin: this.vin.value,
      model: this.model.value,
      color: this.color.value,
      status: 0
    }
  }

  sendNewVehicle() {
    this.setVehicle();


  }

}
