import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit {
  public appearance = new FormControl();

  public vin = '';

  public claim: Protos.Claim | undefined;

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
    this.service.getClaim(this.vin).subscribe((data: Protos.Claim) => {
      this.claim = data;
    });
  }

  deleteClaim(): void {
    this.service.deleteClaim(this.vin).subscribe(
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
}
