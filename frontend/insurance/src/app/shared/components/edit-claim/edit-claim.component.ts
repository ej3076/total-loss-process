import { Component, OnInit, Input } from '@angular/core';
import { EditFileDialogComponent } from '../files/files.component';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';
import { Router } from '@angular/router';
import { VinInfoService } from '../../../core/services/vin-info/vin-info.service';
import { VehicleData } from '../../interfaces/VehicleData';

@Component({
  selector: 'app-edit-claim-new',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimSharedComponent implements OnInit {
  @Input()
  claim!: Protos.Claim;

  vehicleData: VehicleData;
  displayedColumns: string[] = ['filename', 'type', 'edit', 'download'];
  dataSource = new MatTableDataSource(this.claim ? this.claim.files : []);

  // Form Controls
  vehicleForm: FormGroup;
  insurerForm: FormGroup;
  canSubmitVehicleChanges = false;
  canSubmitInsurerChanges = false;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: MiddlewareService,
    private vinService: VinInfoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.vehicleForm = this.formBuilder.group({
      miles: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });
    this.insurerForm = this.formBuilder.group({
      insurerName: ['', [Validators.required]],
      gap: [''],
      deductible: ['', Validators.required],
    });

    this.vehicleData = {
      model: '',
      modelYear: '',
      basePrice: '',
    };
  }

  ngOnInit() {
    if (this.claim && this.claim.files) {
      this.dataSource = new MatTableDataSource(this.claim.files);

      this.getVehicleModel(this.claim.vehicle.vin);

      this.vehicleForm = this.formBuilder.group({
        miles: ['', []],
        location: ['', []],
      });

      this.insurerForm = this.formBuilder.group({
        insurerName: [
          { value: this.claim.insurer.name, disabled: true },
          [Validators.required],
        ],
        gap: this.claim.insurer.has_gap,
        deductible: [
          { value: this.claim.insurer.deductible },
          [Validators.required],
        ],
      });

      this.onChanges();
    }
  }

  getVehicleModel(vin: string) {
    this.vinService.getVinData(vin).subscribe(
      result => {
        if (result) {
          this.vehicleData.model = result.Results[0].Model
            ? result.Results[0].Model
            : 'Not Found';
          this.vehicleData.basePrice = result.Results[0].BasePrice
            ? result.Results[0].BasePrice
            : 'Not Found';
          this.vehicleData.modelYear = result.Results[0].ModelYear
            ? result.Results[0].ModelYear
            : 'Not Found';
        }
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
  }

  openDialog(file: Protos.File): void {
    const dialog = this.dialog.open(EditFileDialogComponent, {
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
      if (
        this.vehicleForm.controls['miles'].value === this.claim.vehicle.miles ||
        this.vehicleForm.controls['location'].value ===
          this.claim.vehicle.location
      ) {
        this.canSubmitVehicleChanges = false;
      } else {
        this.canSubmitVehicleChanges = true;
      }
    });

    this.insurerForm.valueChanges.subscribe(() => {
      this.canSubmitInsurerChanges = true;
    });
  }

  areFieldsUntouched(): boolean {
    return !(
      this.vehicleForm.controls['miles'].value &&
      this.vehicleForm.controls['location'].value &&
      this.insurerForm.controls['insurerName'].value &&
      this.insurerForm.controls['deductible'].value
    );
  }

  submitVehicleEdit(): void {
    const claim = {
      vehicle: {
        vin: this.claim.vehicle.vin,
        miles: +this.vehicleForm.controls['miles'].value
          ? +this.vehicleForm.controls['miles'].value
          : +this.claim.vehicle.miles,
        location: this.vehicleForm.controls['location'].value
          ? <string>this.vehicleForm.controls['location'].value
          : this.claim.vehicle.location,
      },
    };

    this.service.editClaim(claim).subscribe(
      data => {
        if (data) {
          const newClaim = <Protos.Claim>data;
          this.claim.vehicle = newClaim.vehicle;
          this.claim.modified = newClaim.modified;

          this.snackBar.open('Vehicle edit successful.', 'OK', {
            duration: 4000,
          });
        }
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
    this.canSubmitVehicleChanges = false;
  }

  onChange(): void {
    this.claim.insurer.has_gap = !this.claim.insurer.has_gap;
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
          ? this.insurerForm.controls['gap'].value
          : this.claim.insurer.has_gap,
        deductible: this.insurerForm.controls['deductible'].value
          ? +this.insurerForm.controls['deductible'].value
          : this.claim.insurer.deductible,
      },
    };

    this.service.editClaim(claim).subscribe(
      data => {
        if (data) {
          const newClaim = <Protos.Claim>data;
          this.claim.insurer = newClaim.insurer;
          this.claim.modified = newClaim.modified;

          this.snackBar.open('Insurer edit successful.', 'OK', {
            duration: 4000,
          });
        }
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
    this.canSubmitInsurerChanges = false;
  }

  deleteClaim(): void {
    this.service.deleteClaim(this.claim.vehicle.vin).subscribe(
      () => {
        this.snackBar.open('Claim successfully deleted.', undefined, {
          duration: 5000,
        });

        this.router.navigate(['/']);
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
  }

  claimBackward(): void {
    const claim = {
      status: +this.claim.status - 1,
      vehicle: {
        vin: this.claim.vehicle.vin,
      },
    };

    this.service.editClaim(claim).subscribe(
      data => {
        if (data) {
          this.claim = data;

          this.snackBar.open(
            `Claim status updated to: ${this.claim.status}`,
            'OK',
            {
              duration: 5000,
            },
          );
        }
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
  }

  claimForward(): void {
    const claim = {
      status: +this.claim.status + 1,
      vehicle: {
        vin: this.claim.vehicle.vin,
      },
    };

    this.service.editClaim(claim).subscribe(
      data => {
        if (data) {
          this.claim = data;

          this.snackBar.open(
            `Claim status updated to: ${this.claim.status}`,
            'OK',
            {
              duration: 5000,
            },
          );
        }
      },
      error => {
        this.snackBar.open(`${error.message}`, 'OK');
      },
    );
  }

  downloadFile(hash: string, name: string) {
    this.service.downloadFile(this.claim.vehicle.vin, hash, name).subscribe(
      blob => {
        const url = URL.createObjectURL(new File([blob], name));
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error => {
        this.snackBar.open(
          'File hash mismatch. File has been tampered with.',
          'OK',
        );
      },
    );
  }

  get gapValue() {
    return this.insurerForm.controls['gap'].value.toLowerCase() === 'yes'
      ? true
      : false;
  }

  nameOfType(type: number): string {
    switch (type) {
      case 1:
        return 'Power of Attorney';
      case 2:
        return 'Title';
      case 3:
        return 'Odometer Disclosure';
      case 4:
        return 'Police Report';
      case 5:
        return 'Settlement Offer';
      case 6:
        return 'Letter of Guarantee';
      default:
        return 'Miscellaneous';
    }
  }
}
