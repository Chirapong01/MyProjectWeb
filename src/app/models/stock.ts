export class stock {
    stockId: string
    billProduct: string
    status: string
    creationDatetime: Date
    listProduct: listProduct[]
}

export class listProduct {
    productId: string
    productName: string
    price: number
    amount: number
    totalPrice: number
}