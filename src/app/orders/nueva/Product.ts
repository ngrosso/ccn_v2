export class Product {
    id:number
    sku: string;
    description: string;
    quantity: number;
    typeContainer: string;
    quantityContainer: number;
    minimumOrder: number;
    pallets: number;
    etd: any;

    constructor(id:number,sku: string, description: string, quantity: number, typeContainer: string, quantityContainer: number, minimumOrder: number, pallets: number) {
        this.id=id;
        this.sku = sku;
        this.description = description;
        this.quantity = quantity;
        this.typeContainer = typeContainer;
        this.quantityContainer = quantityContainer;
        this.minimumOrder = minimumOrder;
        this.pallets = pallets;
    }

   
}