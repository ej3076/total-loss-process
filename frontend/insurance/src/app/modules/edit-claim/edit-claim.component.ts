import { Component, OnInit } from '@angular/core';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss'],
})
export class EditClaimComponent implements OnInit {
  vin = '';
  claim!: Protos.Claim;

  constructor(
    private route: ActivatedRoute,
    private service: MiddlewareService,
  ) {
    this.route.params.subscribe(params => {
      this.vin = params.vin;

      this.service.getClaim(this.vin).subscribe(data => {
        if (data) {
          this.claim = data;
        }
      });
    });
  }

  ngOnInit() {}
}
