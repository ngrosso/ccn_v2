import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService],
})

export class AppComponent implements OnInit {
  title = 'consapi';
  userList: any = [];
  countryList: any = [];
  
  constructor(private userService: ApiService){
  }

  ngOnInit(): void {
  }

}
