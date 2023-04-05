import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  loading = false;
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.forgotPasswordForm = this.fb.group({
      usuario: ['', Validators.required]
    })
  }

  resetPassword() {
    this.loading = true;
    this.apiService.getIDCSAccessToken().subscribe({
      next: (res: any) => {
        const userDataToken = {
          token: res.access_token,
          expiresIn: res.expires_in,
          dateToken: new Date().getTime()
        };
      },
      error: (err: any) => {
        this.loading = false;
        console.log(err);
      }
    });
  }

  ngOnInit(): void {
  }

}
