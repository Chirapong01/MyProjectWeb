import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallApiService } from './services/call-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'POSweb';
  formLogin: any
  statusLogin: any
  submitLogin: boolean = false
  statusUsername: boolean
  dataUser: any
  statusNav: boolean[] = [false, false, false, false, false, false, false, false]


  constructor(public callapi: CallApiService, public fb: FormBuilder, public router: Router) {
    this.statusLogin = localStorage.getItem('statuslogin')
    this.statusNav[parseInt(localStorage.getItem('index'))] = true
    this.dataUser = localStorage.getItem('rankuser')
    this.formLogin = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  get formValidLogin() { return this.formLogin.controls }

  checkUserAndPass() {
    console.log(this.formLogin.value);

    //empty input//
    if (this.formLogin.value.userName == "") {
      this.submitLogin = true
      this.statusUsername = false
      this.formLogin.value.userName = null
    } else if ((this.formLogin.value.userName == null && this.formLogin.value.password == null) || (this.formLogin.value.userName == "" && this.formLogin.value.password == "")) {
      this.submitLogin = true
      this.statusUsername = false

    }

    //  checkvalidator //
    if (this.formLogin.value.userName != null) {
      this.callapi.checkUser(this.formLogin.value.userName).subscribe(data => {
        if (data.toString() == 'ชื่อนี้มีในระบบแล้ว') {
          if (this.formLogin.value.password != null) {
            this.callapi.getUserByUsername(this.formLogin.value.userName).subscribe((data) => {
              if (data.password == this.formLogin.value.password) {
                this.login()
                this.submitLogin = false
              } else {
                this.submitLogin = true
                this.statusUsername = true
              }
            })
          } else {
            this.submitLogin = true
            this.statusUsername = true
          }
        } else {
          this.submitLogin = true
          this.statusUsername = true
        }
      })
    }
  }

  login() {
    this.callapi.checkUserAndPass(this.formLogin.value.userName, this.formLogin.value.password).subscribe(name => {
      this.statusNav = [false, false, false, false, false, false, false, false]
      localStorage.setItem('iduser', name.userId)
      localStorage.setItem('rankuser', name.rank)
      localStorage.setItem('statuslogin', 'login')
      this.statusLogin = localStorage.getItem('statuslogin')
      this.dataUser = localStorage.getItem('rankuser')
      if (name.rank == 'CEO' || name.rank == 'ADMIN') {
        this.statusNav[0] = true
        localStorage.setItem('index', '0')
        this.router.navigateByUrl('/manager-dashboard')
      }
      if (name.rank == 'SELL') {
        localStorage.setItem('index', '1')
        this.statusNav[1] = true
        this.router.navigateByUrl('/sell-main')
      }
      if (name.rank == 'STOCK') {
        localStorage.setItem('index', '2')
        this.statusNav[2] = true
        this.router.navigateByUrl('/product-detail')
      }
    },error =>{
      this.submitLogin = true
      this.statusUsername = true
    })
  }

  onChange() {
    this.submitLogin = false
    this.statusUsername = false
  }

  logout() {
    localStorage.setItem('statuslogin', 'logout')
    localStorage.removeItem('iduser')
    localStorage.removeItem('rankuser')
    localStorage.removeItem('custommer')
    location.reload()
  }

  checkColor(status: string) {
    for (let i = 0; i < this.statusNav.length; i++) {
      if (i == parseInt(status)) {
        this.statusNav[i] = true
        localStorage.setItem('index', i.toString());
      } else {
        this.statusNav[i] = false
      }
    }
  }
  
}


