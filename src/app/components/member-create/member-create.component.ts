import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { customer } from 'src/app/models/customer';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-member-create', 
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.css']
  
})
export class MemberCreateComponent implements OnInit {
  @ViewChild('closebuttonRegister') closebuttonRegister: any;
  @ViewChild('closebuttonDelete') closebuttonDelete: any;

  dataUser: any;
  formAdd: any;
  submitAdd: boolean = false;
  submitEdit: boolean = false;
  formReceive: any;
  receiveCustomer: any;
  receiveCustomerId: any;
  data: any;
  _readOnly: boolean = false;
  searchText: any;
  filterType: any;
  reloadNav:boolean=false
  config = {
    itemsPerPage: 9,
    currentPage: 0
  }

  constructor(public fb: FormBuilder, public callapi: CallApiService, public router: Router) {
    this.formAdd = fb.group({
      customerId: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      customerName: [null, [Validators.required]],
      customerStoreName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      customerTel: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
      score: [null],
      type: [null, [Validators.required]],
      remark: [null],
      status: [null],
      creationDatetime: [null]
    }),
      this.formReceive = fb.group({
        customerId: [null],
        customerName: [null, [Validators.required]],
        customerStoreName: [null, [Validators.required]],
        address: [null, [Validators.required]],
        customerTel: [null, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(10)]],
        score: [null,[Validators.required, Validators.pattern('[0-9]*')]],
        type: [null, [Validators.required]],
        remark: [null],
        status: [null],
        creationDatetime: [null]
      })
    if (this.dataUser == 'CEO' || this.dataUser == 'ADMIN' || this.dataUser == 'SELL') {
      this.router.navigateByUrl('/member-create')
    }
  }

  ngOnInit(): void {
    this.getAllCustomer();
    this.dataUser = localStorage.getItem('rankuser')
    this.formAdd.patchValue({
      customerStoreName: localStorage.getItem('shopname')
    })
    if (this.dataUser == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
  }

  patchValue(receiveCustom: customer) {
    this.formReceive.patchValue({
      customerId: receiveCustom.customerId,
      customerName: receiveCustom.customerName,
      customerStoreName: receiveCustom.customerStoreName,
      address: receiveCustom.address,
      customerTel: receiveCustom.customerTel,
      score: receiveCustom.score,
      type: receiveCustom.type,
      remark: receiveCustom.remark,
      status: receiveCustom.status,
      creationDatetime: receiveCustom.creationDatetime
    })
  }


  onPageChange(event: any) {
    this.config.currentPage = event;
  }

  get formValidAdd() {
    return this.formAdd.controls;
  }
  get fromValidEdit() {
    return this.formReceive.controls;
  }

  getAllCustomer() {
    this.callapi.getAllCustomer().subscribe(cmt => {
      this.receiveCustomer = cmt;
    
    })
  }

  getCustomById(customerId: string) {
    this.callapi.getCustomerByID(customerId).subscribe(ctm => {
      this.receiveCustomerId = ctm;
      this.patchValue(this.receiveCustomerId);
    })
  }

  isReadonlyAndGetData(isReadonly: string, customerId: string) {
    if (isReadonly == "true") {
      this._readOnly = true;
    } else {
      this._readOnly = false;
    }
    this.getCustomById(customerId);
  }

  createMember() {
    this.formAdd.value.status = "Open";
    this.formAdd.value.score = 0;
    this.formAdd.value.creationDatetime = new Date;
    console.log(this.formAdd);
    this.submitAdd = true;
    if (this.formAdd.valid) {
      this.callapi.addCustomer(this.formAdd.value).subscribe(ctm => {
        console.log(ctm);
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มสมาชิกสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.closebuttonRegister.nativeElement.click();
        this.getAllCustomer();
        this.formAdd.value = null;
      })
    }
  }

  deleteCustomer(customerId: string) {
    Swal.fire({
      position: 'top',
      text: "ต้องการลบข้อมูลนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callapi.deleteCustomer(customerId).subscribe(ctm => { })
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'ลบสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
      }
      this.closebuttonDelete.nativeElement.click();
      this.getAllCustomer();
    })
  }

  editCustomer(customerId: string) {
    this.submitEdit = true;
    if (this.formReceive.valid) {
      this.callapi.editCustomer(customerId, this.formReceive.value).subscribe(ctm => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'แก้ไขสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.closebuttonDelete.nativeElement.click();
        this.getAllCustomer();
        
      })
    }
  }

  closeMember(){
    this.submitAdd = false
    this.submitEdit = false
    this.formAdd.patchValue({
      customerId: "",
      customerName: "",
      customerStoreName: "",
      address: "",
      customerTel: "",
      score: "",
      type:"",
      remark: "",
    })
  }



  checkFilterType(type: string) {
    if (type == "standard") {
      this.filterType = "standard";
    } else if (type == "member") {
      this.filterType = "member";
    } else if (type == "vip") {
      this.filterType = "vip";
    } else {
      this.filterType = "";
    }
  }
}
