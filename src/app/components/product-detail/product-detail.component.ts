import { listProduct } from './../../models/stock';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { product } from 'src/app/models/product';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('closebuttonAdd') closebuttonAdd: any;
  @ViewChild('closebuttonDelete') closebuttonDelete: any;

  formAdd: any;
  submitAdd: boolean = false;
  submitEdit:boolean =false;
  formEdit: any;
  receiveProduct: any;
  receiveProductById: any;
  searchText: any;
  filterType: any;
  lastFilterType: any[] = [];
  typeFilter: any[] = [];
  getDataStock: any;
  getPriceStock: listProduct [] = [];

  constructor(public fb: FormBuilder, public callapi: CallApiService) {
    this.formAdd = this.fb.group({
      productId: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      productName: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      model: [null, [Validators.required]],
      type: [null, [Validators.required]],
      costNew: [null],
      costAvg: [null],
      price1: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      price2: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      price3: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      counterProduct: [null],
      balance: [null],
      status: [null],
      userUpdate: [null],
      updationDatetime: [null],
      creationDatetime: [null]
    }),
      this.formEdit = this.fb.group({
        productId: [null],
        productName: [null, [Validators.required]],
        brand: [null, [Validators.required]],
        model: [null, [Validators.required]],
        type: [null, [Validators.required]],
        costNew: [null],
        costAvg: [null],
        price1: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        price2: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        price3: [null, [Validators.required, Validators.pattern('[0-9]*')]],
        balance: [null],
        status: [null],
        userUpdate: [null],
        updationDatetime: [null],
        creationDatetime: [null]
      })
  }

  ngOnInit(): void {
    this.getAllProduct();
  }


  config = {
    itemsPerPage: 6,
    currentPage: 0,
  };


  onPageChange(event) {
    this.config.currentPage = event;
  }

  get formValidAdd() {
    return this.formAdd.controls;
  }

  get formValidEdit() {
    return this.formEdit.controls;
  }

  newProduct() {
    
    this.submitAdd = true;
    this.formAdd.value.status = "Open";
    this.formAdd.value.creationDatetime = new Date;
    this.formAdd.value.updationDatetime = new Date;
    this.formAdd.value.costNew = 0;
    this.formAdd.value.costAvg = 0;
    this.formAdd.value.balance = 0;
    this.formAdd.value.counterProduct = 0;
    if (this.formAdd.valid) {
      this.callapi.addProduct(this.formAdd.value).subscribe(addProd => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มสินค้าสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllProduct();
       
      })
      this.closebuttonAdd.nativeElement.click();
    }
  }

  closeproduct(){
    this.submitAdd = false
    this.formAdd.patchValue({
      productId: "",
      productName: "",
      brand: "",
      model:"",
      type: "",
      costNew: null,
      costAvg: null,
      price1: null,
      price2: null,
      price3: null,
    })
  }

  deleteProduct(productId: string) {
    Swal.fire({
      position: 'top',
      text: "ต้องการลบรายการสินค้านี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบรายการ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callapi.deleteProduct(productId).subscribe(pd => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'ลบสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          })
          this.closebuttonDelete.nativeElement.click();
        })
        this.getAllProduct();
      }
    })
  }

  patchValue(receiveProductById: product) {
    this.formEdit.patchValue({
      productId: receiveProductById.productId,
      productName: receiveProductById.productName,
      brand: receiveProductById.brand,
      model: receiveProductById.model,
      type: receiveProductById.type,
      costNew: receiveProductById.costNew,
      costAvg: receiveProductById.costAvg,
      price1: receiveProductById.price1,
      price2: receiveProductById.price2,
      price3: receiveProductById.price3,
      balance: receiveProductById.balance,
      status: receiveProductById.status,
      userUpdate: receiveProductById.userUpdate,
      updationDatetime: receiveProductById.updationDatetime,
      creationDatetime: receiveProductById.creationDatetime
    });

  }

  editProduct(productId: string) {
    this.submitEdit = true;
    if (this.formEdit.valid) {
      this.formEdit.value.updationDatetime = new Date;
      this.closebuttonDelete.nativeElement.click();
      this.callapi.editProduct(productId, this.formEdit.value).subscribe(edpd => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'แก้ไขสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllProduct();
        
      })
    }

  }

  getProductById(productId: string) {
    this.callapi.getProductByID(productId).subscribe(pd => {
      this.receiveProductById = pd;
      this.patchValue(this.receiveProductById);
    })
  }

  getAllProduct() {
    this.callapi.getAllProduct().subscribe(pd => {
      this.receiveProduct = pd;
      this.filterShow();
    })
  }

  filterShow() {
    for (let data of this.receiveProduct) {
      this.typeFilter.push(data.type)
    }
    for (let i = 0; i < this.typeFilter.length; i++) {
      for (let j = 0; j < this.typeFilter.length; j++) {
        if (this.typeFilter[i] == this.typeFilter[j] && i != j) {
          this.typeFilter.splice(j,1)
          // console.log(this.typeFilter);
          j=0
        }
      }
    }


  }

  checkFilterType(type: string) {
    this.filterType = type;
  }

}
