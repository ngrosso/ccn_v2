import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';

export interface PeriodicElement {
  product: string;
  productName: string;
  quantity: number;
  totalAmount: number;
}

export interface tracking {
  received: string;
  validate: string;
  process: string;
  shipped: string;
  estado: string;
}

export interface trackingDataInfo {
  PedFchEntp: any;
  CliId: any;
  FMAPGOID: any;
  PEDIDTRR: any;
  PEDTOTMON: any;
  PLANRO: any;
  CODMOVID: any;
  PEDNRO: any;
  PEDCOR: any;
  EmpId: any;
  PEDSTS: any;
  PEDTXTEXP: any;
  PEDIDUSRRE: any;
  PEDFCHREAL: any;
  PEDHORREAL: any;
  PEDFLGRTNS: any;
  PEDFLGRTNC: any;
  PEDFLGRTNV: any;
  PRDID: any;
  PEDLINCNTV: any;
  PEDLINCNTC: any;
  PEDLINCNTP: any;
  PEDLINPRC: any;
  PEDLINMON: any;
}

const ELEMENT_DATA: trackingDataInfo[] = [];

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        showError: true,
        displayDefaultIndicatorType: false,
      },
    },
  ],
})
export class DetailsComponent implements OnInit {
  dataDetailsTable: MatTableDataSource<any>;

  checkStatusVar = "";
  
  hidden = false;

  trackingDataList: any = [];

  displayedColumns: string[] = [
    'product',
    'productName',
    'quantity',
    'totalAmount',
  ];

  ordenNumero: number = 132;
  estadoReceived: string = '';
  process: string = '';
  validate: string = '';
  received: string = '';
  shipped: string = '';
  tile = {} as tracking;
  selectedIndex: number | undefined;

  PEDNRO: any;
  PEDFCHREAL: any = '';
  PedFchEntp: any = '';
  PEDLINCNTV: any = '';
  PEDFCHLIB: any = '';
  PEDLINMON: any = '';
  FECHALIBCRE: any = '';
  PEDFCHPRO: any = '';
  PEDNROPLAC: any = '';
  DETAILS: any[] = [];
  fechaReal: any = '';
  PEDFCHENTP: any = '';
  PEDSTS: any = '';
  
  onClick(index: number): void {
    this.selectedIndex = index;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orden: any; details: any },
    private apiService: ApiService
  ) {
    this.dataDetailsTable = new MatTableDataSource();
    this.received = data.orden.received;
    this.process = data.orden.process;
    this.validate = data.orden.validate;
    this.ordenNumero = data.orden.order_Number;
    this.shipped = data.orden.shipped;


    this.PEDLINCNTV = data.orden.PEDLINCN;
    this.PEDLINMON = data.orden.PEDLINMON;
    
    // Order number
    this.PEDNROPLAC = data.orden.PEDNROPLAC;
    // Order Received
    this.PEDFCHREAL = data.orden.PEDFCHREAL;
    // this.PEDFCHREAL = data.details[0].PEDFCHREAL

    // Order Validated
    this.FECHALIBCRE = data.orden.FECHALIBCRE;
    // Order in process
    this.PEDFCHLIB = data.details[0].PEDFCHLIB;
    // Order shipped
    this.PEDFCHPRO = data.details[0].PEDFCHPRO;

    if ( data.orden.PEDSTS == 'RET' || data.orden.PEDSTS == 'LIB' || data.orden.PEDSTS == 'PRC' ) {
      this.PEDSTS = 'IN PROGRESS';
    } else {
      this.PEDSTS = 'SUSPENDED';
    }
    this.DETAILS = data.details;

  }
  
  ngOnInit(): void {
    console.log('Detalles', this.DETAILS);
    this.dataDetailsTable = new MatTableDataSource(this.DETAILS);
  }
  
  toggleBadgeVisibility() {
    console.log('Acá es el botón para el badge')
      this.hidden = !this.hidden;
      
    }

    
  checkStatusReceived(){
    return (this.checkStatusVar = '✔');
  }

  checkStatusValidate(){
    if (this.FECHALIBCRE) {
      return this.checkStatusVar = "✔"
    } else{
      return this.checkStatusVar =""
    }
  }


  checkStatusProcess(){
    if (this.PEDFCHLIB) {
      return this.checkStatusVar = "✔"
    } else{
      return this.checkStatusVar =""
    }
  }

  checkStatusShipped(){
    if (this.PEDFCHPRO) {
      return this.checkStatusVar = "✔"
    } else{
      return this.checkStatusVar =""
    }
  }
  
}
