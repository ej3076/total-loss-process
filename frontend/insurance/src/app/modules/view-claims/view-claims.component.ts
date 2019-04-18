import { Component, OnInit, ViewChild } from '@angular/core';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-view-claims-new',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('300ms ease-in')),
    ]),
  ],
})
export class ViewClaimsComponent implements OnInit {
  dataSource = new MatTableDataSource<Protos.Claim>([]);
  expandedElement: Protos.Claim | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  columnsToDisplay = [
    'status',
    'vin',
    'insuranceName',
    'gap',
    'modified',
    'created',
  ];

  constructor(private middlewareService: MiddlewareService) {}

  ngOnInit() {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.dataSource.data = result;

        this.defaultFilter();

        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      },
    );
  }

  sortClaims(num: any) {
    this.defaultFilter();

    this.dataSource.filter = num.toString();
  }

  applyVinFilter(vin: string) {
    this.dataSource.filterPredicate = (claim, filter) => {
      return claim.vehicle.vin.indexOf(filter) !== -1;
    };

    this.dataSource.filter = vin.trim();

    if (this.dataSource.filter.length === 0) {
      this.defaultFilter();
    }
  }

  defaultFilter(): void {
    this.dataSource.filterPredicate = (claim, filter) => {
      return claim.status === +filter;
    };

    this.dataSource.filter = '0';
  }
}
