import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserValidationService {

  constructor(private router: Router,
  ) { }

  isLoggedIn() {
    const storageUserDataRaw = sessionStorage.getItem("userDataToken");
    let storageUserData = undefined
    if (storageUserDataRaw != null) storageUserData = JSON.parse(storageUserDataRaw);
    if (storageUserDataRaw != null && storageUserData != undefined && this.isValidToken(storageUserData.expiresIn, storageUserData.dateToken))
      return storageUserData.token
    else {
      sessionStorage.clear()
      this.router.navigate(['verificacion'])
    }
    return null

  }

  isValidToken(expiresIn: number, dateToken: Date) {
    const currentDate = new Date();
    const dateTokenParsed = new Date(dateToken);
    return new Date(dateTokenParsed.setSeconds(dateTokenParsed.getSeconds() + (expiresIn * 1000))).getTime() > currentDate.getTime()
  }
}
