import { Component, OnInit, VERSION } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log(
      '%cStarting Component Home Page',
      'color: #f709bb;  font-family: Poppins, "Helvetica Neue", sans-serif; text-decoration: underline;'
    );

    const userData = sessionStorage.getItem('userDataToken');

    console.log('userData ' + typeof userData);

    if (userData != null) {
      const userDataString = JSON.parse(userData);
      // console.log(userDataString.token);
      // const { token, expiresIn, dateToken } = userDataString;
      console.log(userDataString.expiresIn);
    }

    //  this.apiService.getAccounts()

    // this.apiService.getAccounts(this.userDataString.token).subscribe({
    //   next: (res: any) => {
    //     res.items.forEach((account: any) => {
    //       if (account.ParentAccountPartyNumber != null) {
    //         this.apiService.bodegas.push(account);
    //       } else if (account.OrganizationDEO_EMPID_c == '1') {
    //         return this.formErrorAccount(
    //           'Invalid platform, please use the Mobile App!'
    //         );
    //       } else {
    //         this.apiService.padre = account;
    //         console.log('Account', this.apiService.padre);
    //       }
    //     });
    //     this.router.navigate(['login']);
    //   },
    //   error: (err) => {
    //      this.formErrorAccount('');
    //     console.log(err);
    //   },
    // });

    // this.router.navigate(['verificacion'])
    this.grupoEmpresario = this.apiService.padre;
    this.bodegas = this.apiService.bodegas;
    console.log(this.bodegas);
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
