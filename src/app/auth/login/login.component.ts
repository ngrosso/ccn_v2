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
    this.apiService.postOAuthToken(this.form.value.usuario, this.form.value.password).subscribe({
      next: (res: any) => {
        this.apiService.getAccounts(res.token_type, res.access_token).subscribe({
          next: (res: any) => {
            res.items.forEach((account: any) => {
              if (account.ParentAccountPartyNumber != null) {
                this.apiService.bodegas.push(account)
              } else if (account.OrganizationDEO_EMPID_c == "1") {
                return this.formError("Invalid platform, please use the Mobile App!")
              } else {
                this.apiService.padre = account
              }
            })
            this.router.navigate(['inicio'])
          },
          error: (err) => {
            this.formError("");
            console.log(err)
          }
        })
        this.form.reset()
      },
      error: (err: any) => {
        this.formError("");
        console.log(err)
      }
    })


  }

  formError(description: any) {
    const desc = description || 'Incorrect user or password'
    this._snackBar.open(desc, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  ngOnInit(): void {
    //sessionStorage.setItem("partyNumber", "1Yp")
  }

}