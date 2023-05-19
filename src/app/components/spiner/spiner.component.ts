import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-spiner',
  templateUrl: './spiner.component.html',
  styleUrls: ['./spiner.component.css']
})
export class SpinerComponent implements OnInit {

  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
  }

}
