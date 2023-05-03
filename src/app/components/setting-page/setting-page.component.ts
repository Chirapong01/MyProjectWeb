import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { user } from 'src/app/models/user';
import { CallApiService } from 'src/app/services/call-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {


  input: boolean[] = [true, true, true, true]

  editSettingSell: any
  settingData: any
  rankuser: any

  nameStatus: boolean
  submitCheck: boolean = false
  submitSettingSell: boolean = false

  imgUrl: any
  fileName: any

  keeepId: any
  receiveUser: any
  // newPasswd: any

  statusNav: boolean[] = [false, false]

  constructor(public callapi: CallApiService, public fb: FormBuilder) {
    this.statusNav[0] = true;
    this.settingData = fb.group({
      userId: [null],
      password: [null, Validators.required],
      userName: [null],
      userTel: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]],
      rank: [null],
      status: [null],
      newPasswd: [null, Validators.required],
    })
    this.editSettingSell = fb.group({
      vat: [null, [Validators.required, Validators.pattern('[0-9]*')]],
      idSell: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      txtId: [null, [Validators.required]],
      shopName: [null, [Validators.required]]
    })

  }

  ngOnInit(): void {
    this.fileName = localStorage.getItem('image')
    this.rankuser = localStorage.getItem('rankuser')
    this.getUserByID()
    this.patchData()
  }


  checkUserAndPass() {
    this.settingData.value.userName = this.keeepId.userName
    console.log(this.settingData.value.userName)
    console.log(this.settingData.value.password)
    console.log(this.submitCheck)
    this.submitCheck = true
    if (this.settingData.valid) {
      this.callapi.checkUserAndPass(this.settingData.value.userName, this.settingData.value.password).subscribe(check => {
        this.editUser()
      }, error => Swal.fire({
        text: 'รหัสผ่านเดิมไม่ถูกต้อง',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      })
      )
    }
  }



  editUser() {
    this.settingData.value.userId = this.keeepId.userId
    this.settingData.value.userName = this.keeepId.userName
    if (this.keeepId.rank == 'พนักงานขาย') this.settingData.value.rank = 'SELL'
    else if (this.keeepId.rank == 'พนักงานคลัง') this.settingData.value.rank = 'STOCK'
    else if (this.keeepId.rank == 'ผู้บริหาร') this.settingData.value.rank = 'CEO'
    else if (this.keeepId.rank == 'ผู้ดูแลระบบ') this.settingData.value.rank = 'ADMIN'
    this.settingData.value.status = this.keeepId.status
    this.settingData.value.password = this.settingData.value.newPasswd

    console.log(this.settingData.value.userId)
    console.log(this.settingData.value)

    this.callapi.editUser(this.settingData.value.userId, this.settingData.value).subscribe(send => {
      Swal.fire(
        {
          title: 'บันทึกการแก้ไขสำเร็จ',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        }
      )
     })
  }


  DataValue(receiveUser: user) {
    this.settingData.patchValue({
      userName: receiveUser.userName,
      rank: receiveUser.rank,
      userTel: receiveUser.userTel
    })
  }

  get checkValid() { return this.settingData.controls }
  get checkbill() { return this.editSettingSell.controls }

  getUserByID() {
    localStorage.getItem('iduser')
    this.callapi.getUserByID(localStorage.getItem('iduser')).subscribe(send => {
      console.log(send)
      this.keeepId = send
      if (send.rank == 'SELL') this.keeepId.rank = 'พนักงานขาย'
      else if (send.rank == 'STOCK') this.keeepId.rank = 'พนักงานคลัง'
      else if (send.rank == 'CEO') this.keeepId.rank = 'ผู้บริหาร'
      else if (send.rank == 'ADMIN') this.keeepId.rank = 'ผู้ดูแลระบบ'
      this.DataValue(this.keeepId);
    })
  }

  editBill() {
    this.submitSettingSell = true
    console.log(this.editSettingSell.value);
    console.log(this.editSettingSell.valid);

    if (this.editSettingSell.valid) {
      Swal.fire({
        title: 'คุณแน่ใจที่จะแก้ไขข้อมูลหรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitSettingSell = false
          this.input[0] = true
          this.input[1] = true
          this.input[2] = true
          this.input[3] = true
          console.log(this.editSettingSell.value);
          localStorage.setItem('idsell', this.editSettingSell.value.idSell)
          localStorage.setItem('vat', this.editSettingSell.value.vat)
          localStorage.setItem('txtid', this.editSettingSell.value.txtId)
          localStorage.setItem('shopname', this.editSettingSell.value.shopName)
          Swal.fire(
            {
              text: 'แก้ไขข้อมูลสำเร็จ',
              showConfirmButton: false,
              icon: 'success',
              timer: 1000
            }
          )
        }
      })
    }else{
      Swal.fire({
        timer:500,
        title:'กรุณากรอกข้อมูลให้ครบถ้วน',
        icon:'warning',
        showConfirmButton:false
      })
    }
  }

  toggleBtn(position: number) {
    this.input[position] = !this.input[position];
    this.submitSettingSell = false
  }

  patchData() {
    this.editSettingSell.patchValue({
      vat: localStorage.getItem('vat'),
      idSell: localStorage.getItem('idsell'),
      shopName: localStorage.getItem('shopname'),
      txtId: localStorage.getItem('txtid')
    })
  }

  checkColor(status: string) {
    for (let i = 0; i < this.statusNav.length; i++) {
      if (i == parseInt(status)) {
        this.statusNav[i] = true
      } else {
        this.statusNav[i] = false
      }
    }
  }
}

  // upload file //

  // onFileChange(event) {
  //   const file = event.target.files[0];
  //   this.fileName = file.name
  //   console.log(file.name)
  //   localStorage.setItem('image', file.name)
  //   this.imgUrl = "../../../assets/img1.jpg"
  // }
  // uploadFile() {

  // }
