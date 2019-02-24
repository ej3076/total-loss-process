import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MiddlewareService } from '../middleware/middleware.service';
import { switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})
export class EditClaimComponent implements OnInit {
  private claim: Protos.Claim

  files: FileList;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MiddlewareService
  ) {}

  ngOnInit() {
    const vin = this.route.snapshot.paramMap.get('vin');

    this.service.getClaim(vin).subscribe(data => this.claim = data);
  }

  setFiles(event) {
    this.files = event.target.files;

    console.log(this.files);
  }

  submitFiles() {
    const observable = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.addFiles(this.files, params.get('vin')))
    );

    console.log(observable.subscribe());
  }
}
