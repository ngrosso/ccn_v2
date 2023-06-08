import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NuevaComponent } from '../nueva/nueva.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  public notificationCustom: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { totalAmountReached: boolean}) {
    this.notificationCustom = data.totalAmountReached;
  }
  ngOnInit(): void {
  }



}
