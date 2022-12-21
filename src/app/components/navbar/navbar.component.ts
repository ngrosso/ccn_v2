import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  accountsList: any = []
  selectedAccount: any = {}
  isFixedNavbar:any;
  @HostBinding('class.navbar-opened') navbarOpened = false;
  constructor(private apiService: ApiService,private router: Router) { }


  ngOnInit(): void {
  }

  selectAccount(account: any): any {
    console.log(account)
  }


  signOut(){
    this.apiService.padre = {} as any
    this.apiService.bodegas = []
    this.apiService.bodegaSeleccionada = {} as any
    this.apiService.account = {} as any
    this.router.navigate(['/auth/login'])    
  }
}
