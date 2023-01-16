import { Component, OnInit, VERSION } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserValidationService } from 'src/app/services/user-validation.service';

export interface Amount {
  totalAmount: string;
  wareHouse1: string;
  wareHouse2: string;
  wareHouse3: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  bodegas: any[] = [];
  grupoEmpresario: any = {};

  amount: Amount = {
    totalAmount: '100.000$',
    wareHouse1: '50.000$',
    wareHouse2: '20.000$',
    wareHouse3: '30.000$',
  };

  form: FormGroup;
  userDataString: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private userValidation: UserValidationService
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    const tokenInfo = this.userValidation.isLoggedIn();
    if(tokenInfo!=null && JSON.stringify(this.apiService.padre) === "{}" && this.apiService.bodegas.length == 0){
      this.apiService.getAccounts(tokenInfo).subscribe({
        next: (res: any) => {
          res.items.forEach((account: any) => {
            if (account.ParentAccountPartyNumber != null) {
              this.apiService.bodegas.push(account);
              console.warn(
                'Acá debería de mostrar un error antes del error1'
              );
            } else if (account.OrganizationDEO_EMPID_c == '1') {
              this.formErrorAccount("Mobile account detected!")
            } else {
              this.apiService.padre = account;
              console.log('Account', this.apiService.padre);
            }
          });
          this.grupoEmpresario = this.apiService.padre;
          this.bodegas = this.apiService.bodegas;
        },
        error: (err) => {
          console.log(err);
        },
      });
  
    }
    // this.router.navigate(['verificacion'])
   
    this.grupoEmpresario = this.apiService.padre;
    this.bodegas = this.apiService.bodegas;
    
  }

  formErrorAccount(description: any) {
    const desc = description || 'Este error es el de FormErrorAccount';
    this._snackBar.open(desc, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
