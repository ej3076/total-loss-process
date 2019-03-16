import { Component, OnInit, Input } from '@angular/core';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';

@Component({
  selector: 'app-edit-claim',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})
export class EditClaimComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;

  constructor(private middlewareService: MiddlewareService) {  }

  
  ngOnInit() {
  }

}
