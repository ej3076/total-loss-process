import { Component, OnInit, Input } from '@angular/core';
import { EditFileDialog } from '../files/files.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit-claim-new',
  templateUrl: './edit-claim.component.html',
  styleUrls: ['./edit-claim.component.scss']
})
export class EditClaimComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;
  displayedColumns: string[] = ['filename', 'action'];
  dataSource: any = null;

  constructor(public dialog: MatDialog) {  }

  
  ngOnInit() {
    if (this.claim && this.claim.files) {
      this.dataSource = this.claim.files;
      console.log(this.dataSource);
    }
  }

  openDialog(file: Protos.File): void {
    const dialogRef = this.dialog.open(EditFileDialog, {
      width: '500px',
      data: file
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
