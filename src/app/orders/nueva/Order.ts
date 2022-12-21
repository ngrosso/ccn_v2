import { Product } from "./Product";

export class Order {
    poNbr: number;
    shipTo: string;
    incortem: string;
    soldTo: string;
    etd: any;
    shipmentType: string;
    products: Product []

    constructor(poNbr: number, shipTo: string, incortem: string, soldTo: string,etd: any, shipmentType: string, products: Product[]) {
        this.poNbr = poNbr;
        this.shipTo = shipTo;
        this.incortem = incortem;
        this.soldTo = soldTo;
        this.etd = etd;
        this.products = products
        this.shipmentType = shipmentType;
    }
}