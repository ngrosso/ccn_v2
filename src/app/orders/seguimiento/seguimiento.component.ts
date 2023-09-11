import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddService } from 'src/app/services/add.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetailsComponent } from '../details/details.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isNgTemplate } from '@angular/compiler';
import { UserValidationService } from '../../services/user-validation.service';


export interface trackingDataInfo {
  PedFchEntp: any
  CliId: any
  FMAPGOID: any
  PEDIDTRR: any
  PEDTOTMON: any
  PLANRO: any
  CODMOVID: any
  PEDNRO: any
  PEDCOR: any
  EmpId: any
  PEDSTS: any
  PEDTXTEXP: any
  PEDIDUSRRE: any
  PEDFCHREAL: any
  PEDHORREAL: any
  PEDFLGRTNS: any
  PEDFLGRTNC: any
  PEDFLGRTNV: any
  PRDID: any
  PEDLINCNTV: any
  PEDLINCNTC: any
  PEDLINCNTP: any
  PEDLINPRC: any
  PEDLINMON: any
}

const ELEMENT_DATA: trackingDataInfo[] = [];

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})

export class SeguimientoComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isSpinnerData: boolean = true;

  trackingDataListHeader: any = []
  trackingDataListDetails: any = []
  displayedColumns: string[] = ['details', 'status','order_Number', 'sold_Number', 'sold_to', 'etd_solicitado', 'ETA_solicitada', 'totalAmount','refresh'];


  constructor(public dialog: MatDialog, private addService: AddService, public router: Router, public _location: Location, private apiService: ApiService, private userValidation: UserValidationService) {
    this.dataSource = new MatTableDataSource();
    this.getTrackingInfoListHeader()
      .then((response: any) => {
        this.dataSource = new MatTableDataSource(this.trackingDataListHeader);
        this.dataSource.paginator = this.paginator;
      })
    this.getTrackingInfoListDetails()
  }

  async getTrackingInfoListHeader() {
    return new Promise(async (resolve) => {
      const trackingInfoPromises = this.apiService.bodegas.map(async (bodega) => {
        return await this.callApiServiceGeTrackingInfoHeader(bodega.PartyNumber);
      });
      const trackingsInfo = await Promise.all(trackingInfoPromises);
      trackingsInfo.forEach((trackingInfo: any) => {
        if(trackingInfo != null) this.trackingDataListHeader = [...this.trackingDataListHeader,...trackingInfo];
      });
      resolve(true);
    })
  }

  async callApiServiceGeTrackingInfoHeader(partyNumber: string) {
    return new Promise((resolve, reject) => {
      this.apiService.getTrackingInfoHeaders(partyNumber)
        .subscribe({
          next: (trackingList: any) => {
            resolve(trackingList);
          },
           error: (error: any) => {
              resolve([]);
          }
          }
        );
    });
  }


  async getTrackingInfoListDetails() {
    return new Promise(async (resolve) => {
      const trackingInfoPromises = this.apiService.bodegas.map(async (bodega) => {
        return await this.callApiServiceGeTrackingInfoDetails(bodega.PartyNumber);
      });
      const trackingsInfo = await Promise.all(trackingInfoPromises);
      trackingsInfo.forEach((trackingInfo: any) => {
        if(trackingInfo != null) this.trackingDataListDetails = [...this.trackingDataListDetails,...trackingInfo ];
      });
      resolve(true);
    })
  }

  async callApiServiceGeTrackingInfoDetails(partyNumber: string) {
    return new Promise((resolve, reject) => {
      this.apiService.getTrackingInfoDetails(partyNumber)
        .subscribe({
          next: (trackingList: any) => {
            resolve(trackingList);
          },
           error: (error: any) => {
              resolve([]);
          }
          }
        );
    });
  }

  ngOnInit(): void {
    if (this.userValidation.isLoggedIn() != null && JSON.stringify(this.apiService.padre) === "{}" && this.apiService.bodegas.length == 0) {
      this.router.navigate(['inicio'])
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(element: any): void {
    const DETAILS = this.trackingDataListDetails.filter((item : any) => item.PEDNRO == element.PEDNRO )
    let dialogRef = this.dialog.open(DetailsComponent, {
      width: '60%',
      height: '70%',
      data: { orden: element, details: DETAILS},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Thedialog was closed');
    });
    
 
  }

  refresh(): void {
    this.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
      console.log(decodeURI(this._location.path()));
      this.router.navigate([decodeURI(this._location.path())]);
    });
  }

}