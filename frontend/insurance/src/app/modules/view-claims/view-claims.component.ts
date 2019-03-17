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
      state(
        'collapsed, void',
        style({ height: '0px', minHeight: '0', display: 'none' }),
      ),
      state('expanded', style({ height: '*' })),
      transition('* <=> *', animate('150ms cubic-bezier(0.4, 0.4, 0.2, 1)')),
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

  constructor(private middlewareService: MiddlewareService) {
    this.dataSource.filterPredicate = (claim, filter) => {
      const status = parseInt(filter, 10) || -1;
      return claim.status === status || status === -1;
    };
  }

  ngOnInit() {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.dataSource.data = result;
        console.log('Claims: ');
        console.log(result);
      },

      error => {
        console.log(error);
      },
    );
    this.dataSource.sort = this.sort;
  }
  

  sortClaims(num: number) {
    this.dataSource.filter = num.toString();
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
