import { Component, OnInit } from '@angular/core';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-claims-new',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss']
})
export class ViewClaimsComponent implements OnInit {
  claims: Protos.Claim[] = [];

  displayedColumns: string[] = ['vin', 'dateOfLoss'];
  dataSource: any;

  constructor(private middlewareService: MiddlewareService) { }

  ngOnInit() {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.claims = [...result];
        this.dataSource = new MatTableDataSource(this.claims);
      },
      error => {
        console.log(error);
      },
    );
  }

}
