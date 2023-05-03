import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { customer } from 'src/app/models/customer'
import { product } from 'src/app/models/product'
import { stock } from 'src/app/models/stock'
import { user } from 'src/app/models/user'
import { weatherForecast } from 'src/app/models/weatherForecast'
import { sell } from '../models/sell';

@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  constructor(public http: HttpClient) { }

  // customer
  public getAllCustomer() {
    return this.http.get<customer>(`${environment.apiUrl}Customer/GetAllCustomer`)
  }
  public getCustomerByID(customerID: string) {
    return this.http.get<customer>(`${environment.apiUrl}Customer/GetCustomerByid/${customerID}`)
  }
  public getCustomerByDate(date: Date) {
    return this.http.get<customer>(`${environment.apiUrl}Customer/GetCustomerByDate/${date}`)
  }
  public getCustomerByRangeDate(start: Date, end: Date) {
    return this.http.get<customer>(`${environment.apiUrl}Customer/GetCustomerByRangeDate/${start}/${end}`)
  }
  public addCustomer(customer: customer) {
    return this.http.post<customer>(`${environment.apiUrl}Customer/AddCustomer`, customer)
  }
  public editCustomer(customerID: string, customer: customer) {
    return this.http.put<customer>(`${environment.apiUrl}Customer/EditCustomer/${customerID}`, customer)
  }
  public deleteCustomer(customerID: string) {
    return this.http.get<customer>(`${environment.apiUrl}Customer/DeletedCustomer/${customerID}`)
  }

  // product
  public getAllProduct() {
    return this.http.get<product>(`${environment.apiUrl}Product/GetAllProduct`)
  }
  public getProductByBrand(brand: string) {
    return this.http.get<product>(`${environment.apiUrl}Product/GetProductByBrand/${brand}`)
  }
  public getProductByType(type: string) {
    return this.http.get<product>(`${environment.apiUrl}Product/GetProductBytype/${type}`)
  }
  public getProductByDate(date: Date) {
    return this.http.get<product>(`${environment.apiUrl}Product/GetProductByDate/${date}`)
  }
  public getProductByRangeDate(start: Date, end: Date) {
    return this.http.get<product>(`${environment.apiUrl}Product/GetCustomerByRangeDate/${start}/${end}`)
  }
  public getProductByID(productID: string) {
    return this.http.get<product>(`${environment.apiUrl}Product/GetProductByid/${productID}`)
  }
  public addProduct(product: product) {
    return this.http.post<product>(`${environment.apiUrl}Product/AddProduct`, product)
  }
  public editProduct(productID: string, product: product) {
    return this.http.put<product>(`${environment.apiUrl}Product/EditProduct/${productID}`, product)
  }
  public deleteProduct(productID: string) {
    return this.http.get<product>(`${environment.apiUrl}Product/DeletedProduct/${productID}`)
  }


  // stock
  public getAllStock() {
    return this.http.get<stock>(`${environment.apiUrl}Stock/GetAllStock`)
  }
  public getStockByID(stockID: string) {
    return this.http.get<stock>(`${environment.apiUrl}Stock/GetStockByid/${stockID}`)
  }
  public getStockByDate(date: Date) {
    return this.http.get<stock>(`${environment.apiUrl}Stock/GetStockByDate/${date}`)
  }
  public getStockByRangeDate(start: Date , end :Date) {
    return this.http.get<stock>(`${environment.apiUrl}Stock/GetStockByRangeDate/${start}/${end}`)
  }
  public addStock(stock: stock) {
    return this.http.post<stock>(`${environment.apiUrl}Stock/AddStock/`, stock)
  }
  public editStock(stockID: string) {
    return this.http.get<stock>(`${environment.apiUrl}Stock/EditStock/${stockID}`)
  }
  public deleteStock(stockID: string) {
    return this.http.get<stock>(`${environment.apiUrl}Stock/DeletedStock/${stockID}`)
  }

  // user
  public getAllUser() {
    return this.http.get<user>(`${environment.apiUrl}User/GetAllUser`)
  }
  public getUserByID(userID: string) {
    return this.http.get<user>(`${environment.apiUrl}User/GetUserByid/${userID}`)
  }
  public getUserByUsername(userName: string) {
    return this.http.get<user>(`${environment.apiUrl}User/GetUserByUsername/${userName}`)
  }
  public addUser(user: user) {
    return this.http.post<user>(`${environment.apiUrl}User/AddUser`, user)
  }
  public editUser(userID: string , user : user) {
    return this.http.put<user>(`${environment.apiUrl}User/EditUser/${userID}`,user)
  }
  public deleteUser(userID: string) {
    return this.http.get<user>(`${environment.apiUrl}User/DeletedUser/${userID}`)
  }
  public checkUser(username: string) {
    return this.http.get<user>(`${environment.apiUrl}User/CheckUser/${username}`,{responseType: 'text' as 'json' })
  }
  public checkUserAndPass(username: string, password: string) {
    return this.http.get<user>(`${environment.apiUrl}User/CheckUserAndPass/${username}/${password}`)
  }

  // weatherForecast
  public weatherForecast() {
    return this.http.get<weatherForecast>(`${environment.apiUrl}WeatherForecast`)
  }

  //sell
  public getAllSell() {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetAllSell`)
  }
  public getSellByID(sellID: string) {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetByidSell/${sellID}`)
  }
  public getSellByDate(date: Date) {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetSellByDate/${date}`)
  }
  public getSellByRangeDate(start: Date , end :Date) {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetSellByRangeDate/${start}/${end}`)
  }
  public getSellByMonth(start: Date , end :Date) {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetSellByMonth/${start}/${end}`)
  }
  public getSellByYear(start: Date , end :Date) {
    return this.http.get<sell>(`${environment.apiUrl}Sell/GetSellByYear/${start}/${end}`)
  }
  public addSell(sell: sell) {
    return this.http.post<sell>(`${environment.apiUrl}Sell/AddSell`,sell)
  }

}
