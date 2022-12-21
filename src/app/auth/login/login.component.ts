import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  form: FormGroup
  loading: boolean | undefined;

  constructor(

    private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private apiService: ApiService) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ingresar() {
    this.apiService.signin(this.form).subscribe({
      next: (res: any) => {
        //TODO: Identificar cual es la cuenta padre y partir de esa
        res.items.forEach((account: any) => {
          if (account.ParentAccountPartyNumber != null) {
            this.apiService.bodegas.push(account)
          } else {
            this.apiService.padre = account
          }
        })
        this.router.navigate(['inicio'])
      },
      error: (err) => {
        this.formError();
        console.log(err)
      }
    })
    this.form.reset()

  }

  formError() {
    this._snackBar.open('Incorrect user or password', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  ngOnInit(): void {
    sessionStorage.setItem("partyNumber", "1Yp")
  }

}