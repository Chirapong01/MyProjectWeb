import { listProduct } from "./stock"

export class sell {
    sellId: string
    shopName: string
    customerStoreName: string
    taxId: string
    netPrice: number
    totalPrice: number
    discount: number
    perDiscount: number
    vat: number
    receiveMoney: number
    changeMoney: number
    listSellItem: listSellItem[]
    status: string
    creationDatetime: string
}

export class listSellItem {
    productId: string
    productName: string
    price: number
    amount: number
    totalPrice: number
}
