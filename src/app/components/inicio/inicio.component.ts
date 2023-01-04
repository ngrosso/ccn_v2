import { Component, OnInit, VERSION } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';


export interface Amount {
  totalAmount: string;
  wareHouse1:string;
  wareHouse2:string;
  wareHouse3:string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  bodegas: any[] = [];
  grupoEmpresario: any = {}

  amount: Amount = {
    totalAmount: '100.000$',
    wareHouse1: '50.000$',
    wareHouse2: '20.000$',
    wareHouse3: '30.000$',

  };


  constructor( private apiService: ApiService,private router: Router){}

  ngOnInit() {
    // this.apiService.getAccounts()
    // this.router.navigate(['verificacion'])
    this.grupoEmpresario = this.apiService.padre
    this.bodegas = this.apiService.bodegas
    console.log(this.bodegas)
  }
}