import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from 'src/app/models/user';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detaill',
  templateUrl: './user-detaill.component.html',
  styleUrls: ['./user-detaill.component.css']
})
export class UserDetaillComponent implements OnInit {
  @ViewChild('closebuttonDelete') closebuttonDelete: any;
  @ViewChild('closebuttonRegister') closebuttonRegister: any;

  dataUser: any
  submit: boolean = false;
  summitModal: boolean = false;
  searchText: any
  getAllUser: any
  formEditUser: any
  formRegister: any
  rankUser: any
  config = {
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: 0
  }

  constructor(public callapi: CallApiService, formBuilder: FormBuilder, public router: Router) {
    this.formEditUser = formBuilder.group({
      userId: null,
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      userTel: [null, [Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(10)]],
      rank: null,
      status: null
    }),
      this.formRegister = formBuilder.group({
        userId: [null, [Validators.required]],
        userName: [null, [Validators.required]],
        password: [null, [Validators.required]],
        userTel: [null, [Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(10)]],
        rank: [null, [Validators.required]],
        status: [null]
      })
  }
  get formEdituser() { return this.formEditUser.controls }

  ngOnInit(): void {
    this.getAllUserData()
    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'SELL') {
      this.router.navigateByUrl('/sell-main')
    }
    if (this.dataUser == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
  }

  onPageChage(event: any) {
    this.config.currentPage = event
  }

  getUserId(id: string) {
    this.callapi.getUserByID(id).subscribe(data => {
      this.rankUser = data.rank
      this.formEditUser.patchValue({
        userId: data.userId,
        userName: data.userName,
        password: data.password,
        userTel: data.userTel,
        rank: data.rank,
        status: data.status
      })
    })
  }

  get formRegisterValid() {
    return this.formRegister.controls;
  }

  registerUser() {
    this.submit = true;
    this.summitModal = false;
    this.formRegister.value.status = "Open";
    console.log(this.formRegister.value);
    if (this.formRegister.valid) {
      this.callapi.addUser(this.formRegister.value).subscribe(rgt => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'เพิ่มผู้ใช้งานสำเร็จ',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllUserData();
        this.closebuttonRegister.nativeElement.click();
      })
    }
  }

  editUser() {
    this.submit = false;
    this.summitModal = true;
    if (this.formEditUser.valid) {
      this.callapi.editUser(this.formEditUser.value.userId, this.formEditUser.value).subscribe(data => {
        Swal.fire({
          title: 'แก้ไขสำเร็จ',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        })
        this.getAllUserData()
      })
      this.closebuttonDelete.nativeElement.click();
    }
  }

  deleteUser(id: string) {
    Swal.fire({
      position: 'top',
      text: "ต้องการลบข้อมูลนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callapi.deleteUser(id).subscribe(ctm => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'ลบสำเร็จ',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllUserData();
        })
      }
    })
  }

  closeUser(){
    this.submit = false
    this.summitModal = false
    this.formRegister.patchValue({
      userId: "",
      userName: "",
      password: "",
      userTel: "",
      rank: "",
    })
  }

  getAllUserData() {
    this.callapi.getAllUser().subscribe(data => {
      this.getAllUser = data
      console.log(this.getAllUser);
    })
  }

}
