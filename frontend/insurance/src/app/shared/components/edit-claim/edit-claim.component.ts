import { Component, OnInit, Input } from '@angular/core';
import { EditFileDialog } from '../files/files.component';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';

@Component({
  selector: 'app-edit-claim-new',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit {
  @Input()
  claim!: Protos.Claim;

  displayedColumns: string[] = ['filename', 'action'];
  dataSource = new MatTableDataSource(this.claim ? this.claim.files : []);

  successfulVehicleEdit = false;
  successfulInsurerEdit = false;

  // Form Controls
  vehicleForm: FormGroup;
  insurerForm: FormGroup;
  canSubmitVehicleChanges = false;
  canSubmitInsurerChanges = false;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: MiddlewareService,
  ) {
    this.vehicleForm = this.formBuilder.group({});
    this.insurerForm = this.formBuilder.group({});
  }

  ngOnInit() {
    if (this.claim && this.claim.files) {
      this.dataSource = new MatTableDataSource(this.claim.files);

      this.vehicleForm = this.formBuilder.group({
        miles: '',
        location: '',
      });

      this.insurerForm = this.formBuilder.group({
        insurerName: '',
        gap: '',
        deductible: '',
      });

      this.onChanges();
    }
  }

  openDialog(file: Protos.File): void {
    const dialog = this.dialog.open(EditFileDialog, {
      width: '500px',
      data: { file: file, vin: this.claim.vehicle.vin },
    });

    const sub = dialog.componentInstance.claim.subscribe(
      (data: Protos.Claim) => {
        this.claim = data;
      },
    );

    dialog.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  receiveNewClaim($event: Protos.Claim): void {
    this.claim = $event;

    this.dataSource = new MatTableDataSource($event.files);
    console.log(this.dataSource);
  }

  onChanges(): void {
    this.vehicleForm.valueChanges.subscribe(() => {
      this.canSubmitVehicleChanges = true;
    });

    this.insurerForm.valueChanges.subscribe(() => {
      this.canSubmitInsurerChanges = true;
    });
  }

  submitVehicleEdit(): void {
    const claim = {
      vehicle: {
        vin: this.claim.vehicle.vin,
        miles: this.vehicleForm.controls['miles'].value
          ? +this.vehicleForm.controls['miles'].value
          : this.claim.vehicle.miles,
        location: this.vehicleForm.controls['location'].value
          ? this.vehicleForm.controls['location'].value
          : this.claim.vehicle.location,
      },
    };

    this.service.editClaim(claim).subscribe(data => {
      const claim = <Protos.Claim>data;
      this.claim.vehicle = claim.vehicle;
      this.claim.modified = claim.modified;

      this.successfulVehicleEdit = true;
    });
  }

  submitInsurerEdit(): void {
    const claim = {
      vehicle: {
        vin: this.claim.vehicle.vin,
      },
      insurer: {
        name: this.insurerForm.controls['insurerName'].value
          ? this.insurerForm.controls['insurerName'].value
          : this.claim.insurer.name,
        has_gap: this.insurerForm.controls['gap'].value
          ? this.gapValue
          : this.claim.insurer.has_gap,
        deductible: this.insurerForm.controls['deductible'].value
          ? this.insurerForm.controls['deductible'].value
          : this.claim.insurer.deductible,
      },
    };

    this.service.editClaim(claim).subscribe(data => {
      const claim = <Protos.Claim>data;
      this.claim.insurer = claim.insurer;
      this.claim.modified = claim.modified;

      this.successfulInsurerEdit = true;
    });
  }

  deleteClaim(): void {
    this.service.deleteClaim(this.claim.vehicle.vin).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => {
        alert('SUCCESSFULLY DELETED');
      },
    );
  }

  get gapValue() {
    return this.insurerForm.controls['gap'].value.toLowerCase() === 'yes'
      ? true
      : false;
  }
}
