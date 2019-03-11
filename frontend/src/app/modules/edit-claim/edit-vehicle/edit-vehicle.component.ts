import { Component, OnInit, Input } from '@angular/core';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MiddlewareService } from '../../../middleware/middleware.service';

const alyleStyle = (theme: ThemeVariables) => ({
  paper: {
    display: 'block',
    margin: '.2em',
    padding: '.8em',
  },
  noClaims: {
    display: 'block',
    margin: '3rem auto auto auto',
    padding: '1em',
  },
  claim: {
    padding: '16px',
    borderRadius: '4px',
  },
  claimLink: {
    color: theme.primary.default,
    '&:hover': {
      color: theme.warn.default,
    },
  },
});

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss'],
})
export class EditVehicleComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;

  @Input()
  vin = '';

  readonly classes = this._theme.addStyleSheet(alyleStyle);
  public appearance = new FormControl();

  public isEditing = false;

  public vehicleForm = new FormGroup({
    model: new FormControl('', [Validators.required]),
    color: new FormControl(''),
    acv: new FormControl(''),
    miles: new FormControl(''),
    year: new FormControl('', [Validators.required]),
  });

  constructor(private _theme: LyTheme2, private service: MiddlewareService) {
    this.appearance.setValue('outlined');
  }

  ngOnInit() {
    this.setInitialFormValues();
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  setInitialFormValues(): void {
    this.vehicleForm.patchValue({
      model:
        this.claim && this.claim.vehicle.model ? this.claim.vehicle.model : '',
      color:
        this.claim && this.claim.vehicle.color ? this.claim.vehicle.color : '',
      // acv: TODO,
      miles:
        this.claim && this.claim.vehicle.miles ? this.claim.vehicle.miles : '',
      year:
        this.claim && this.claim.vehicle.miles ? this.claim.vehicle.miles : '',
    });
  }

  submitClaimEdit(): void {
    const claim = {
      vehicle: {
        vin: this.vin,
        color: this.vehicleForm.controls['color'].value,
        model: this.vehicleForm.controls['model'].value,
        miles: +this.vehicleForm.controls['miles'].value,
        // acv: this.vehicleForm.controls['acv'].value,
        year: +this.vehicleForm.controls['year'].value,
      },
    };

    this.service.editClaim(claim);
  }
}
