import { Component, OnInit, ViewChild } from '@angular/core';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-view-claims-new',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('* <=> *', animate('150ms cubic-bezier(0.4, 0.4, 0.2, 1)')),
    ]),
  ],
})
export class ViewClaimsComponent implements OnInit {    
  claims: Protos.Claim[] = [];
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Protos.Claim>;
  columnsToDisplay = ['vin', 'insuranceName', 'gap', 'modifiedDate', 'createdDate'];
  expandedElement: Protos.Claim | null = null;

  constructor(private middlewareService: MiddlewareService) {}

  ngOnInit() {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.claims = [...result];
        console.log(this.claims);
        this.dataSource = new MatTableDataSource(this.claims);
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      },
    );
  }

}
