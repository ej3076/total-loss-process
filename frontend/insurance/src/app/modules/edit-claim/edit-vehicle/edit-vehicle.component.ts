import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';

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

  public appearance = new FormControl();

  public isEditing = false;

  public vehicleForm = new FormGroup({
    model: new FormControl('', [Validators.required]),
    color: new FormControl(''),
    acv: new FormControl(''),
    miles: new FormControl(''),
    year: new FormControl('', [Validators.required]),
  });

  constructor(private service: MiddlewareService) {
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
      model: 'FIXME...',
      color: 'FIXME...',
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
        year: +this.vehicleForm.controls['year'].value,
      },
    };

    this.service.editClaim(claim);
  }
}
