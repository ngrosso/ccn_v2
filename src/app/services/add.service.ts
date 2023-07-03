import { Component, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Product } from '../orders/nueva/Product';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from '../orders/nueva/Order';


export interface Orden {
  sku: any;
  description: any;
  etd: any;
  quantity: any;
  typeContainer: any;
  quantityContainer: any;
  paymentType: string;
}

@Injectable({
  providedIn: 'root',

})

export class AddService {

  productos: any[];
  private productos$: Subject<any[]>;

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.productos = [];
    this.productos$ = new Subject();
  }


  async agregarProducto(shoppingCartId: any, producto: Product, etd: any,paymentType: any,listPrice:any) {
    return new Promise((resolve, reject) => {    
      producto["etd"] = etd
      this.productos.push(producto);
      this.productos$.next(this.productos);
      // console.log(shoppingCartId, producto.id, producto.quantity,)
      this.apiService.postShoppingCartItem(shoppingCartId, producto.id, producto.quantity, paymentType,listPrice).subscribe({
        next: (data: any) => {
          this.messageAdd();
          resolve(data);
        },
        error: (err: any) => {
          console.log(err)
        }
      }
      )
    });
  }

  getProductos(): Observable<Product[]> {
    return this.productos$.asObservable();
  }

  messageAdd() {
    this._snackBar.open('The product has been added to the shopping cart 🛒', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-true']
    })
  }
  
}

