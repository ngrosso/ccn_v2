import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { AddService, Orden } from 'src/app/services/add.service';
import { Product } from './Product';
import { Order } from './Order';
import { logicFilling } from './logic';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmOrderComponent } from '../confirm-order/confirm-order.component';
import { MatDialog } from '@angular/material/dialog';
import { UserValidationService } from 'src/app/services/user-validation.service';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';

export interface Data {
  sku: string;
  description: number;
  quantity: number;
}

interface pay {
  value: string;
  name: string;
}

const ELEMENT_DATA: Data[] = [];

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.css'],
  providers: [AddService],
})
export class NuevaComponent {
  // Metodos de pago
  pays: pay[] = [
    { value: 'GR', name: 'Credit' },
    { value: 'UN', name: 'Debit' },
  ];

  // Orden de columnas para tabla
  displayedColumns: string[] = [
    'sku',
    'description',
    'ListPrice',
    'quantity',
    'totalAmount',
    'action',
  ];

  bodegas: any[] = [];
  gstValue: string = 'GR';
  selectedProduct = {} as any;
  selectedProductDetails = {} as any;
  incoterm: string = '';
  shipTo: string = '';
  hidden = false;
  cantidad: any;
  selected = 'Truck';
  shipmentType: string = '';
  buttonDisabled: boolean = true;
  formHeader: FormGroup;
  formProduct: FormGroup;
  productsList: any = [];
  accountAddressesList: any = [];
  shoppingCartList: any = [];
  minDate: Date;
  maxDate: Date;
  productos: Product[] = [];
  warehouseAmount: number = 0;
  totalAmount: string = '';
  grupoEmpresario: any = {};
  dataSourceShoppingCarts: any[] = ELEMENT_DATA;
  CantidadDeContenedorTotal: number = 1;
  territory: string = '';
  PesoTotalARepartir: number = 0;
  pallets: number[] = [];
  auxPallets: number[] = [];
  pesoMaximo = 0;
  pesoMinimo = 10000;
  availableCapacity = 20000;
  RESPONSE: any = [];
  disabledPaymentType = false;
  pesoTotal: number = 0;
  pesoTotalFloat: string = '0.00';
  availableWidthUse: string = '0.00';
  selectedProductoWeight: string = '0.00';
  totalAmountReached = false;
  warehouseAmountAfterPurchase: number = 0;
  businessGroupAfterPurchase: number = 0;
  balanceStatus: any;
  outstandingBalance: any;
  days = 30;
  addEnabled = true;
  repeatOrder = false;

  constructor(
    private fb: FormBuilder,
    private addService: AddService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private userValidation: UserValidationService
  ) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    this.minDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 30
    );

    this.maxDate = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      today.getDate()
    );

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + this.days);
    const date = new Date(2020, 11, 16);

    this.formHeader = new FormGroup({
      paymentType: new FormControl(),
      territory: new FormControl(),
      etd: new FormControl(Validators.required),
      poNbr: new FormControl(),
      incortem: new FormControl(),
      balanceStatus: new FormControl(),
      outstandingBalance: new FormControl(),
      soldTo: new FormControl(),
      shipTo: new FormControl(),
      shipmentType: new FormControl(),
    });

    this.formProduct = new FormGroup({
      sku: new FormControl(),
      description: new FormControl(),
      containerType: new FormControl(),
      quantity: new FormControl(),
      loading: new FormControl(),
      minimumOrder: new FormControl(1, Validators.min(1)),
      quantityContainer: new FormControl(),
      pallets: new FormControl(),
      shipmentType: new FormControl(),
    });
  }

  ngOnInit(): void {
    if (
      this.userValidation.isLoggedIn() != null &&
      JSON.stringify(this.apiService.padre) === '{}' &&
      this.apiService.bodegas.length == 0
    ) {
      this.router.navigate(['inicio']);
    }
    this.accountAddressesList = this.apiService.bodegas;
    this.accountAddressesList.sort(function (a: any, b: any) {
      return compareStrings(a.OrganizationName, b.OrganizationName);
    });
    this.addService.getProductos().subscribe((productos) => {
      this.productos = productos;
    });
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  getAccountShoppingCart() {
    this.apiService
      .getAccountInfo(this.apiService.bodegaSeleccionada.PartyNumber)
      .subscribe((account: any) => {
        // TODO: unificar llamada del getAccountInfo
        this.getItemShoppingCart(
          account.OrganizationDEO___ORACO__ShoppingCart_Id_c
        );
      });
  }

  getItemShoppingCart(shoppingCartId: any) {
    this.apiService
      .getShoppingCartItems(shoppingCartId)
      .subscribe((shoppingCart: any) => {
        this.shoppingCartList = shoppingCart.items;
      });
  }

  async selectSoldTo(account: any) {
    this.selectedProductoWeight = '0.00';
    this.PesoTotalARepartir = 0;
    this.pallets = [];
    this.auxPallets = [];
    this.productsList = [];
    this.apiService.bodegaSeleccionada = account;
    this.getItemPrices();
    await this.getShoppingCartList(
      this.apiService.bodegaSeleccionada
        .OrganizationDEO___ORACO__ShoppingCart_Id_c
    );
    this.getContainers();
    this.incoterm = account.OrganizationDEO_INCOTERM_c;
    this.balanceStatus = account.OrganizationDEO_AmountUsed_c;
    this.outstandingBalance = account.OrganizationDEO_AmountDue_c;
    this.shipTo = account.FormattedAddress;
    this.warehouseAmount = parseFloat(
      account.OrganizationDEO_DisponibleDeCredito_c.toFixed(2)
    );

    this.grupoEmpresario = this.apiService.padre;
    this.territory = account.OrganizationDEO_Territorio_c;
    this.totalAmountReachedfn();
    this.repeatOrder = false;
  }

  totalAmountReachedfn() {
    this.totalAmountReached = false;
    if (
      (this.grupoEmpresario.OrganizationDEO_AmountDue_c > 0 ||
        this.grupoEmpresario.OrganizationDEO_AvailableCredit_c < 0 ||
        this.grupoEmpresario.OrganizationDEO_DisponibleDeCredito_c < 0) &&
      this.gstValue == 'GR'
    )
      this.totalAmountReached = true;
    console.log(this.gstValue);
  }

  async onSubmitProducto() {
    // Boton de agregado
    //TODO: abrir el modal  de add item NO PUEDE CERRAR HASTA QUE TERMINE EN getShoppingCartList
    this.disabledPaymentType = true;
    this.addEnabled = false;

    this.pesoMaximo -=
      this.formProduct.value.pallets *
      this.selectedProductDetails.PesoProducto_c;
    this.addService
      .agregarProducto(
        this.apiService.bodegaSeleccionada
          .OrganizationDEO___ORACO__ShoppingCart_Id_c,
        new Product(
          this.selectedProduct.InvItemId,
          this.formProduct.value.sku.ItemNumber,
          this.formProduct.value.sku.ItemDescription,
          this.formProduct.value.quantity,
          this.formProduct.value.typeContainer,
          this.formProduct.value.quantityContainer,
          this.formProduct.value.minimumOrder,
          this.formProduct.value.pallets
        ),
        this.formHeader.value.etd,
        this.formHeader.value.paymentType,
        this.selectedProduct.ListPrice
      )
      .then((res) => {
        this.getShoppingCartList(
          this.apiService.bodegaSeleccionada
            .OrganizationDEO___ORACO__ShoppingCart_Id_c
        );
        this.RESPONSE = res;
        this.addEnabled = true;
      });
    this.PesoTotalARepartir = 0;
    this.selectedProductoWeight = '0.00';
  }

  getItems() {
    this.apiService
      .getItems()
      .subscribe((products: any) => (this.productsList = products.items));
    console.log(this.productsList);
  }

  getItemPrices() {
    this.apiService
      .getAccountInfo(this.apiService.bodegaSeleccionada.PartyNumber)
      .subscribe((account: any) => {
        this.apiService.account = account;
        this.apiService
          .getPriceList(account.OrganizationDEO___ORACO__PriceBook_Id_c)
          .subscribe((priceBookInfo: any) => {
            this.getShoppingCartList(
              this.apiService.bodegaSeleccionada
                .OrganizationDEO___ORACO__ShoppingCart_Id_c
            );
            if (priceBookInfo.StatusCode == 'ACTIVE') {
              this.apiService
                .getPrice(account.OrganizationDEO___ORACO__PriceBook_Id_c)
                .subscribe((priceItems: any) => {
                  this.productsList = priceItems.items;
                  this.productsList.sort(function (a: any, b: any) {
                    return compareStrings(a.ItemDescription, b.ItemDescription);
                  });
                });
            }
          });
      });
  }

  async completarOrden() {
    // ConfimarOrden - Boton de confirmación

    await this.apiService
      .confirmationShoppingCart(
        this.apiService.bodegaSeleccionada
          .OrganizationDEO___ORACO__ShoppingCart_Id_c
      )
      .subscribe(async (response: any) => {
        this.apiService
          .getOrderLinesRollupFilter(
            this.apiService.bodegaSeleccionada.PartyId,
            this.RESPONSE.__ORACO__ComboSelQuantity_c
          )
          .subscribe(async (lines: any) => {
            const orderID = lines.items[0].__ORACO__Order_Id_c;
            const containerType = this.shipmentType;
            await this.apiService
              .patchIdOrder(
                orderID,
                this.formHeader.value.poNbr,
                this.formHeader.value.etd,
                containerType,
                this.RESPONSE.__ORACO__ComboSelQuantity_c,
                this.formHeader.value.paymentType,
                this.apiService.bodegaSeleccionada.OrganizationDEO_Territorio_c
              )
              .subscribe((response) => console.info(response));
            this.openDialog();
            this.repeatOrder = true;
            await this.shoppingCartList.forEach(async (product: any) => {
              console.log('product', product);
              await this.apiService
                .postShoppingCartItem(
                  this.apiService.bodegaSeleccionada
                    .OrganizationDEO___ORACO__ShoppingCart_Id_c,
                  product.__ORACO__Product_Id_c,
                  product.__ORACO__Quantity_c,
                  product.__ORACO__Tax1_c,
                  product.__ORACO__Tax2_c
                )
                .pipe(retry(3))
                .subscribe((response: any) => {
                  this.RESPONSE = response;
                });
            });
          });
      });
    this.shoppingCartList = await this.getShoppingCartList(
      this.apiService.bodegaSeleccionada
        .OrganizationDEO___ORACO__ShoppingCart_Id_c
    );
  }

  calculo(cantidadDeProducto: number) {
    this.PesoTotalARepartir =
      this.selectedProductDetails.PesoProducto_c * cantidadDeProducto;
    this.selectedProductoWeight = this.PesoTotalARepartir.toFixed(2);
    this.availableWidthUse = (
      this.pesoMaximo -
      this.pesoTotal -
      this.PesoTotalARepartir
    ).toFixed(2);
  }

  seRepiteSKU() {
    let seRepite = false;
    try {
      this.shoppingCartList.forEach((product: any) => {
        if (product.__ORACO__Product_Id_c == this.selectedProduct.InvItemId) {
          seRepite = true;
        }
        return seRepite;
      });
    } catch (e) {}
    return seRepite;
  }

  validaPrecio() {
    let validaPrecio = false;
    if (
      this.formProduct.value.pallets * this.selectedProduct.ListPrice <
      this.warehouseAmount
    ) {
      validaPrecio = true;
    }
    return validaPrecio;
  }

  error() {
    this._snackBar.open('Invalid quantity', '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getContainers() {
    this.apiService
      .getListAddress(this.apiService.bodegaSeleccionada.PartyNumber)
      .subscribe((address: any) => {
        this.apiService
          .getShipmentType(
            this.apiService.bodegaSeleccionada.PartyNumber,
            address.items[0].AddressNumber
          )
          .subscribe((shipmentType: any) => {
            this.shipmentType =
              shipmentType.PartySiteEO_TIPODECONTENEDOR_c == 'Terrestre'
                ? 'Land Shipping'
                : 'Maritime Shipping';
            this.pesoMaximo =
              shipmentType.PartySiteEO_TIPODECONTENEDOR_c == 'Terrestre'
                ? 21000
                : 20500;
          });
      });
  }

  async getShoppingCartList(shoppingCartId: number) {
    this.apiService
      .getShoppingCartItems(shoppingCartId)
      .subscribe((shoppingCart: any) => {
        this.shoppingCartList = shoppingCart.items;
        if (shoppingCart.count > 0) this.RESPONSE = shoppingCart.items[0];
        this.dataSourceShoppingCarts = this.shoppingCartList;
        let maxCapacity = this.pesoMaximo;
        this.shoppingCartList.forEach((item: any) => {
          maxCapacity -= item.__ORACO__Quantity_c;
        });
        if (this.shoppingCartList.length > 0) {
          this.gstValue =
            this.shoppingCartList[0].__ORACO__Tax1_c == 1 ? 'GR' : 'UN';
          this.disabledPaymentType = true;
        } else {
          this.disabledPaymentType = false;
        }
        this.warehouseAmountAfterPurchase = parseFloat(
          this.warehouseAmount.toFixed(2)
        );
        let totalAmount = 0;
        this.shoppingCartList.forEach((item: any) => {
          totalAmount += item.__ORACO__Tax2_c * item.__ORACO__Quantity_c;
        });
        this.warehouseAmountAfterPurchase -= parseFloat(totalAmount.toFixed(2));
        this.businessGroupAfterPurchase -= parseFloat(totalAmount.toFixed(2));

        // TODO: Lógica para condición de grupo empresario, revisar

        this.availableCapacity = maxCapacity;
        this.updatePallets();
        this.pesoTotal = 0;
        this.pesoTotalFloat = this.pesoTotal.toFixed(2);
        if (this.shoppingCartList.length > 0) {
          this.shoppingCartList.forEach((product: any) => {
            this.apiService
              .getItemById(product.__ORACO__Product_Id_c)
              .subscribe((item: any) => {
                this.pesoTotal +=
                  product.__ORACO__Quantity_c * item.PesoProducto_c;
                this.pesoTotalFloat = this.pesoTotal.toFixed(2);
                this.availableWidthUse = (
                  this.pesoMaximo -
                  this.pesoTotal -
                  this.PesoTotalARepartir
                ).toFixed(2);
              });
          });
        } else {
          this.availableWidthUse = (
            this.pesoMaximo -
            this.pesoTotal -
            this.PesoTotalARepartir
          ).toFixed(2);
        }
        //TODO: cierra el modal de add item
      });
  }

  getItemInfo(producto: any) {
    this.formProduct.controls['quantity'].reset();
    this.selectedProductoWeight = '0.00';
    this.PesoTotalARepartir = 0;
    this.availableWidthUse = (
      this.pesoMaximo -
      this.pesoTotal -
      this.PesoTotalARepartir
    ).toFixed(2);
    this.pallets = [];
    this.auxPallets = [];
    this.selectedProduct = producto;
    this.apiService.getItemById(producto.InvItemId).subscribe((item: any) => {
      this.selectedProductDetails = item;
      for (let i = 1; i <= 20; i++) {
        if (
          this.selectedProductDetails.CantidadPorPallet_c *
            i *
            this.selectedProductDetails.PesoProducto_c <
          this.pesoMaximo
        ) {
          this.pallets.push(
            this.selectedProductDetails.CantidadPorPallet_c * i
          );
        }
      }
      this.auxPallets = this.pallets;
      this.updatePallets();
    });
  }

  deleteShoppingCartItem(shoppingCartId: any, productId: any) {
    this.apiService
      .deleteShoppingCartItem(shoppingCartId, productId)
      .subscribe((response: any) => {
        this.getShoppingCartList(
          this.apiService.bodegaSeleccionada
            .OrganizationDEO___ORACO__ShoppingCart_Id_c
        );
      });
  }

  updatePallets() {
    if (this.availableCapacity >= 2000) {
      this.pallets = this.auxPallets;
    } else {
      this.pallets = this.pallets.filter(
        (pallet) => pallet < this.availableCapacity
      );
    }
  }

  // Abre dialog para confirm pedido
  openDialog() {
    this.dialog.open(ConfirmOrderComponent, {
      width: '30%',
      disableClose: true,
      data: { totalAmountReached: this.totalAmountReached },
    });
  }

  filteringProducts(productsList: any[]): any[] {
    let result: any[] = [];
    let uomCode = this.formHeader.value.paymentType;
    return productsList.filter((item) => item.PriceUOMCode.includes(uomCode));
  }
  // Funcion para redirect new order
  redirectTo() {
    this.dataSourceShoppingCarts.map(async (product: any) => {
      await this.deleteShoppingCartItem(
        this.apiService.bodegaSeleccionada
          .OrganizationDEO___ORACO__ShoppingCart_Id_c,
        product.Id
      );
    });
    this.router
      .navigateByUrl('inicio', { skipLocationChange: true })
      .then(() => this.router.navigate(['inicio/nueva']));
  }
}

function compareStrings(a: string, b: string) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
}