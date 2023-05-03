import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormControl, FormGroup  } from '@angular/forms';
import { Router } from '@angular/router';
import { listProduct } from 'src/app/models/stock';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-balance',
  templateUrl: './stock-balance.component.html',
  styleUrls: ['./stock-balance.component.css']
})
export class StockBalanceComponent implements OnInit {

  dataUser: any
  getdatastock: any;
  getproductbyid: any
  getdatalistProduct: any
  formstock: any;
  formListProduct: any
  formdate: any
  multiListProduct: listProduct[] = []
  submitstock: boolean = false;
  submitlist: boolean = false;
  config: any;
  showdata: any
  picker: any
  dateRage = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  })

  constructor(public router: Router, public callapi: CallApiService, public fb: FormBuilder) {
    this.formdate = fb.group({
      start: null,
      end: null
    })

    this.formstock = fb.group({
      stockId: [null, [Validators.required]],
      billProduct: [null, [Validators.required]],
      status: [null],
      creationDateTime: [null],
      listProduct: [{
        productId: [null],
        productName: [null],
        price: [null],
        amount: [null]
      }]
    })
    this.config = {
      itemsPerPage: 7,
      currentPage: 0,

    };
    this.formListProduct = fb.group({
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      price: [null, Validators.pattern('[0-9]*')],
      amount: [null, Validators.pattern('[0-9]*')],
      totalPrice: null

    })
  }
  get formStock() { return this.formstock.controls }
  get formlistProduct() { return this.formListProduct.controls }


  ngOnInit(): void {
    this.getAlldatastock()
    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'SELL') {
      this.router.navigateByUrl('/sell-main')
    }
  }
  onaddstock() {
    this.callapi.addStock(this.formstock.value).subscribe(i => { })
    console.log(this.formstock.value);
  }

  getAlldatastock() {
    this.callapi.getAllStock().subscribe(i => {
      this.getdatastock = i;
      console.log(this.getdatastock);
    })
  }

  getAlldatalistProduct() {
    this.callapi.getAllStock().subscribe(ip => {
      this.getdatalistProduct = ip;
      console.log(this.getdatalistProduct);
    })
  }

  addProductToList() {
    this.submitlist = true
    if (this.formListProduct.value.productId != null && this.formListProduct.value.productName != null && this.formListProduct.value.price >= 0 && this.formListProduct.value.amount >= 0) {
      this.formListProduct.value.price = parseInt(this.formListProduct.value.price)
      this.formListProduct.value.amount = parseInt(this.formListProduct.value.amount)
      this.formListProduct.value.totalPrice = this.formListProduct.value.price * this.formListProduct.value.amount
      this.multiListProduct.push(this.formListProduct.value)
      console.log(this.multiListProduct);
    }
  }


  findProductById() {
    this.callapi.getProductByID(this.formListProduct.value.productId).subscribe(data => {
      this.getproductbyid = data
      this.formListProduct.patchValue({
        productId: this.getproductbyid.productId,
        productName: this.getproductbyid.productName,
        price: 0,
        amount: 0,
        totalPrice: 0
      })
      console.log(this.formListProduct.value);
    })
  }
  // ลบสินค้าออกบิล
  delectListProduct(id: number) {
    this.multiListProduct.splice(id, 1)
  }
  // เพิ่มสินค้าเข้าสต็อก
  addProduct() {
    this.submitstock = true
    this.formstock.value.status = "Open"
    this.formstock.value.creationDateTime = new Date();
    this.formstock.value.listProduct = this.multiListProduct
    console.log(this.formstock.value);

    if (this.multiListProduct[0] != undefined && this.formstock.valid) {
      this.callapi.addStock(this.formstock.value).subscribe(i => {
        Swal.fire({
          title: 'เพิ่มสำเร็จ',
          icon: 'success',
          timer: 1500,
          showConfirmButton:false
        })
        this.formstock.patchValue({
          stockId: '',
          billProduct: ''
        })
        this.formListProduct.patchValue({
          productId: '',
          productName: '',
          price: '',
          amount: '',
          totalPrice: ''
        })
        this.submitstock = false
        this.submitlist = false
        for (let i = 0; i <= this.multiListProduct.length; i++) {
          this.multiListProduct.pop()
        }
        this.getAlldatastock()
      })

    }
  }

  showData(id: string) {
    this.callapi.getStockByID(id).subscribe(data => {
      this.showdata = data
      console.log(this.showdata);
    })
  }

  closeStock() {
    this.submitstock = false
    this.submitlist = false
    this.formstock.patchValue({
      stockId: '',
      billProduct: ''
    })
    this.formListProduct.patchValue({
      productId: '',
      productName: '',
      price: '',
      amount: '',
      totalPrice: ''
    })
    for (let i = 0; i <= this.multiListProduct.length; i++) {
      this.multiListProduct.pop()
    }
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }
  // ค้นหาปฏิทิน
  findDate() {
    if (this.dateRage.value.start != null && this.dateRage.value.end != null) {
      this.callapi.getStockByRangeDate(this.dateRage.value.start.toUTCString(), this.dateRage.value.end.toUTCString()).subscribe(data => {
        this.getdatastock = data
      })
    } else if (this.dateRage.value.start != null) {
      this.callapi.getStockByDate(this.dateRage.value.start.toUTCString()).subscribe(data => {
        this.getdatastock = data
      })
    }
  }


}
