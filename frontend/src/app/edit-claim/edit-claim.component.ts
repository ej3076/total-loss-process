import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MiddlewareService } from '../middleware/middleware.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit {
  appearance = new FormControl();
  model = new FormControl('', [Validators.required]);
  color = new FormControl('', [Validators.required]);
  miles = new FormControl('', [Validators.required]);
  year = new FormControl('', [Validators.required]);

  cannotEdit = true;
  claim: Protos.Claim | undefined;
  files: FileList | null = null;
  vin = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MiddlewareService,
  ) {
    this.appearance.setValue('outlined');
  }

  ngOnInit() {
    const vin = this.route.snapshot.paramMap.get('vin');
    if (!vin) {
      this.router.navigate(['/']);
      return;
    }
    this.vin = vin;
    this.service.getClaim(this.vin).subscribe(data => {
      this.claim = data;
      this.setDefaultFormBehavior(data);
    });
  }

  setFiles(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      this.files = event.currentTarget.files;
    }
  }

  deleteFile(filename: string): void {
    // FIXME: This is not correct
    this.service.deleteFile(filename, this.vin).subscribe(
      undefined,
      error => console.log(error),
      () => alert('FILE DELETED')
    );
    // TODO: show visual confirmation of deletion
  }

  submitChanges() {
    if (this.files) {
      this.service.addFiles(this.files, this.vin);
      this.reloadComponent();
    }

    if (this.vehicleIsDirty()) {
      this.submitClaimEdit();
    }
  }

  fieldEditSwitch(): void {
    this.cannotEdit = !this.cannotEdit;

    if (!this.cannotEdit) {
      this.model.disable();
      this.color.disable();
      this.miles.disable();
      this.year.disable();
    } else {
      this.model.enable();
      this.color.enable();
      this.miles.enable();
      this.year.enable();
    }
  }

  setDefaultFormBehavior(data: Protos.Claim): void {
    this.model.setValue(data.vehicle.model);
    this.color.setValue(data.vehicle.color);
    this.miles.setValue(data.vehicle.miles);
    this.year.setValue(data.vehicle.year);

    this.model.disable();
    this.color.disable();
    this.miles.disable();
    this.year.disable();
  }

  vehicleIsDirty(): boolean {
    return (
      this.model.dirty ||
      this.color.dirty ||
      this.miles.dirty ||
      this.year.dirty
    );
  }

  submitClaimEdit(): void {
    const claim = {
      vehicle: {
        vin: this.vin,
        color: this.color.value,
        model: this.model.value,
        miles: +this.miles.value,
        year: +this.year.value,
      },
    };
    this.service.editClaim(claim);
  }

  downloadFile(hash: string, filename: string) {
    this.service.downloadFile(this.vin, hash, filename);
  }

  reloadComponent(): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/claims', this.vin]));
  }
}
