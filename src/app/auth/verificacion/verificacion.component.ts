
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {NgxAgeValidator} from "ngx-age-validator";


@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css'],

})

export class VerificacionComponent implements OnInit {
  title = 'ngx-age-validator-demo';
  buttonDisabled: boolean = true;
  ageFormControl = new FormControl()
  form: FormGroup;
  loading: boolean | undefined;
  login = "/login"
  formBuilder: any;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, @Inject(DOCUMENT) private document: Document) {

    this.form = new FormGroup({
      Date: new FormControl(),
      
    })

  }


  openSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, '', {
      duration: 3000
    });

  }

  validar() {
    console.log(this.form.value);
  }


  ngOnInit(): void {
    this.ageFormControl = new FormControl(null, [NgxAgeValidator(18, 90)])
 
    this.ageFormControl.valueChanges.subscribe(() => {
 
      const controlErrors: ValidationErrors | null = this.ageFormControl.errors;
      if (controlErrors != null) {
        this.buttonDisabled = true
        Object.keys(controlErrors).forEach(keyError => {
          console.log(' keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      } else {
        this.buttonDisabled = false
      }
 
    })
  }

}

