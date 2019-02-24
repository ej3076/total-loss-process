import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MiddlewareService } from '../middleware/middleware.service';
import { switchMap, concatMap, map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { timer, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})
export class EditClaimComponent implements OnInit {
  appearance = new FormControl();
  model = new FormControl('', [Validators.required]);
  color = new FormControl('', [Validators.required]);
  miles = new FormControl('', [Validators.required]);
  year = new FormControl('', [Validators.required]);
  
  cannotEdit: boolean;
  readyToView: boolean;

  private claim: Protos.Claim

  files: FileList;
  vin: string;
  polledStatus$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MiddlewareService
  ) {
    this.appearance.setValue('outlined');
  }

  ngOnInit() {
    this.vin = this.route.snapshot.paramMap.get('vin');

    this.service.getClaim(this.vin).subscribe(data => {
      this.claim = data;
      this.setDefaultFormBehavior(data);
    });
  }

  setFiles(event) {
    this.files = event.target.files;
  }

  deleteFile(hash: string): void {
    this.service.deleteFile(hash, this.claim.vehicle.vin).subscribe();

    //TODO: show visual confirmation of deletion
  }

  submitChanges() {
    if (this.files) {
      const addFilesObservable = this.route.paramMap.pipe(
        switchMap((params: ParamMap) =>
          this.service.addFiles(this.files, params.get('vin')))
      );
  
      addFilesObservable
        .subscribe(
          data => {},
          error => {},
          () => alert("File upload success!")
        );
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

    console.log(this.claim);
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
    if (
      this.model.dirty ||
      this.color.dirty ||
      this.miles.dirty ||
      this.year.dirty
    ) {
      return true;
    }

    return false;
  }

  submitClaimEdit(): void {
    const claim: DeepPartial<Protos.Claim> = {
      vehicle: {
        vin: this.vin,
        color: this.color.value,
        model: this.model.value,
        miles: +this.miles.value,
        year: +this.year.value
      }
    };

    console.log(this.service.editClaim(claim));
  }

  reloadComponent(): void {
    this.router.navigateByUrl('/home', {skipLocationChange: true}).then(()=>
      this.router.navigate([`/claims/${this.vin}`]));
  }
}
