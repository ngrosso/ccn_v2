import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  shoppingCartId(shoppingCartId: any) {
    throw new Error('Method not implemented.');
  }

  public account = {} as any;
  private apiSaleUrl = environment.APISALESURL

  //private auth = "Basic " + btoa(this.username + ":" + this.password)
  private auth = "";
  // public partyNumber = sessionStorage.getItem('partyNumber')
  public padre = {} as any;
  public bodegas: any[] = [];
  public bodegaSeleccionada = {} as any;
  public empId: number = 0
  private contenedor = {
    "EMPID": 4,
    "TPCON": "T",
    "CODCON": 1,
    "TXTCON": "T1",
    "LMTMINP": 200,
    "LMTMAXP": 400,
    "LMTMINV": 20,
    "LMTMAXV": 40,
    "LMTMINB": 10,
    "LMTMAXB": 20,
    "CMBMINP": 4,
    "CMBMAXP": 8
  }

  constructor(private http: HttpClient) {
  }

  postOAuthToken(user: string, password: string): any {
    const body = new URLSearchParams();
    body.set("grant_type", "password");
    body.set("username", user);
    body.set("password", password);
    body.set("scope", environment.APIIDCSSCOPE);
    return this.http.post(environment.APIIDCSURL + '/oauth2/v1/token', body.toString(),
      {
        headers: {
          "Authorization": "Basic " + btoa(environment.CLIENTID + ":" + environment.CLIENTSECRET),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
  }

  getItems(): any {
    return this.http.get(this.apiSaleUrl + "products", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    });
  }

  getItemById(idProducto: number):any {
    return this.http.get(this.apiSaleUrl + "products/" + idProducto, {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    });
  }

  getAccountInfo(partyNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber), {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getStatusOrder(partyNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts?q=PartyNumber=" + (partyNumber) + "&fields=OrganizationName,OwnerName,OrganizationDEO_EstadosDelPedido_c&links=parent", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getAccountChange(partyNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber) + "/child/Relationship/", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getListAddress(partyNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber) + "/child/Address", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getShipmentType(partyNumber: string, addressNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber) + "/child/Address/" + (addressNumber), {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getShoppingCartItems(shoppingCartId: any) {
    return this.http.get(this.apiSaleUrl + "__ORACO__ShoppingCartDSD_c/" + (shoppingCartId) + "/child/__ORACO__ShoppingCartItemCollection_c", {
      headers: { 'Authorization': this.auth },
    });
  }

  deleteShoppingCartItem(shoppingCartId: any, productId: any): any {
    return this.http.delete(this.apiSaleUrl + "__ORACO__ShoppingCartDSD_c/" + (shoppingCartId) + "/child/__ORACO__ShoppingCartItemCollection_c/" + productId, {
      headers: { 'Authorization': this.auth },
    });
  }

  postShoppingCartItem(shoppingCartId: any, productoId: any, cantidad: any, paymentType: any, listPrice: any): any {
    const body = {
      "__ORACO__Product_Id_c": productoId,
      "__ORACO__Quantity_c": cantidad,
      "__ORACO__Tax1_c": (paymentType == 'GR' ? 1 : 4),
      "__ORACO__Tax2_c": listPrice,
      "__ORACO__ComboSelQuantity_c": String(Date.now()).slice(0, 10)

    }
    return this.http.post(this.apiSaleUrl + "__ORACO__ShoppingCartDSD_c/" + (shoppingCartId) + "/child/__ORACO__ShoppingCartItemCollection_c", body, {
      headers: { 'Authorization': this.auth },
    });
  }

  patchIdOrder(idOrder: any, poNumber: any, promiseDate: any, containerType: any, timestampId: any, paymentType: any, territory: any) {
    const body = {
      "__ORACO__AuxiliaryAttribute01_c": territory,
      "__ORACO__AuxiliaryAttribute02_c": containerType,
      "__ORACO__AuxiliaryAttribute03_c": poNumber,
      "__ORACO__AuxiliaryAttribute04_c": (paymentType == 'GR' ? 1 : 4),
      "__ORACO__AuxiliaryAttribute14_c": promiseDate,

    }
    return this.http.patch(this.apiSaleUrl + "__ORACO__OrderRollup_c/" + idOrder, body, {
      headers: { 'Authorization': this.auth },
    });
  }

  confirmationShoppingCart(shoppingCartId: any) {
    const body = {
      "name": "__ORACO__CreateOrderREST"
    }
    return this.http.post(this.apiSaleUrl + "__ORACO__ShoppingCartDSD_c/" + (shoppingCartId), body, {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.action+json" },
    });
  }

  getPrice(priceBook: number): any {
    return this.http.get(this.apiSaleUrl + "priceBookHeaders/" + priceBook + "/child/PriceBookItem?limit=500", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    });
  }

  getPriceList(priceBook: number): any {
    return this.http.get(this.apiSaleUrl + "priceBookHeaders/" + priceBook, {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    });
  }

  getAccounts(access_token: string) {
    this.auth = `Bearer ${access_token}`
    return this.http.get(this.apiSaleUrl + "accounts?limit=500", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" }
    })
  }

  getTrackingInfoHeaders(partyNumber: string) {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber) + "/enclosure/OrganizationDEO_EstadosDelPedidoCabeceras_c", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getOrderLinesRollup() {
    return this.http.get(this.apiSaleUrl + "__ORACO__OrderLineRollup_c/?limit=500", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getOrderLinesRollupFilter(accountId : any, timestamp: any) {
    return this.http.get(`${this.apiSaleUrl}__ORACO__OrderLineRollup_c?q=__ORACO__Account_Id_c=${accountId};__ORACO__ComboSelectionQuantity_c=${timestamp}?limit=500` , {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getTrackingInfoDetails(partyNumber: string): any {
    return this.http.get(this.apiSaleUrl + "accounts/" + (partyNumber) + "/enclosure/OrganizationDEO_EstadosDelPedido_c", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

  getEmpiFilter() {
    return this.http.get(this.apiSaleUrl + "accounts/?q=OrganizationType=1", {
      headers: { 'Authorization': this.auth, 'Content-Type': "application/vnd.oracle.adf.resourcecollection+json" },
    })
  }

}


