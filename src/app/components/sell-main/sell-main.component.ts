import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { product } from 'src/app/models/product';
import { listSellItem, sell } from 'src/app/models/sell';
import { CallApiService } from 'src/app/services/call-api.service';
import pdfMake from 'pdfmake/build/pdfMake'
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { getNumberOfCurrencyDigits, NumberFormatStyle } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sell-main',
  templateUrl: './sell-main.component.html',
  styleUrls: ['./sell-main.component.css']
})
export class SellMainComponent implements OnInit {

  time: Date
  total: number

  testint: number

  formdiscount: any
  formCustomer: any
  formProduct: any
  formDataSell: any
  formShowSellDone: any

  countItemInList: any = 0
  multiListSellItem: listSellItem[] = []
  product: product[] = []
  listSellItem: listSellItem

  dataCustomerById: any
  dataUserById: any
  dataProductAll:any

  submitRecive: boolean = false
  forMatchCurrency = new Intl.NumberFormat()
  constructor(public callapi: CallApiService, formbuilder: FormBuilder, public router: Router) {
    this.formShowSellDone = formbuilder.group({
      reciveMoney: null,
      totalPrice: null,
      changeMoney: null
    })
    this.formCustomer = formbuilder.group({
      customerId: [null, Validators.required]
    })
    this.formProduct = formbuilder.group({
      productId: [null]
    })
    this.formdiscount = formbuilder.group({
      discount: [null, Validators.pattern('[0-9]*')],
      perDiscount: [null, Validators.pattern('[0-9]*')],
      receiveMoney: [null, Validators.pattern('[0-9]*')]
    })
    this.formDataSell = formbuilder.group({
      sellId: [null],
      shopName: [null],
      customerStoreName: [null],
      taxId: [null],
      netPrice: [null],
      totalPrice: [0],
      discount: [null],
      perDiscount: [null],
      vat: [null],
      receiveMoney: [null],
      changeMoney: [null],
      listSellItem: [{
        productId: [null],
        productName: [null],
        price: [null],
        amount: [null],
        totalPrice: [null]
      }],
      status: [null],
      creationDatetime: [null]
    })

    setInterval(() => {
      this.time = new Date();
    }, 1000);

    pdfMake.fonts = {
      THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew-Bold.ttf',
        italics: 'THSarabunNew-Italic.ttf',
        bolditalics: 'THSarabunNew-BoldItalic.ttf'
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    }
  }



  get formControllCuntomer() {
    return this.formCustomer.controls
  }

  get formControllDiscount() {
    return this.formdiscount.controls
  }

  deleteListSell(index: number) {
    this.countItemInList -= 1
    this.formDataSell.value.netPrice -= this.multiListSellItem[index].totalPrice
    this.formDataSell.value.totalPrice = this.formDataSell.value.netPrice + ((this.formDataSell.value.netPrice * this.formDataSell.value.vat) / 100)
    this.multiListSellItem.splice(index, 1)
    console.log(this.multiListSellItem);
  }

  addSell() {
    if (this.multiListSellItem.length != 0) {
      this.formDataSell.value.customerStoreName = this.dataCustomerById.customerName
      this.formDataSell.value.sellId = localStorage.getItem('idsell')
      this.formDataSell.value.shopName = localStorage.getItem('shopname')
      this.formDataSell.value.status = 'Open'
      this.formDataSell.value.taxId = localStorage.getItem('txtid')
      this.formDataSell.value.receiveMoney = parseInt(this.formDataSell.value.receiveMoney)
      this.formDataSell.value.listSellItem = this.multiListSellItem
      this.formDataSell.value.creationDatetime = new Date()
      console.log(this.formDataSell.value.creationDatetime);
      console.log(this.formDataSell.value);
      this.submitRecive = false
      if (this.formDataSell.value.changeMoney >= 0 && this.formDataSell.value.changeMoney != null) {
        if (localStorage.getItem('idsell') != null || localStorage.getItem('shopname') != null || localStorage.getItem('txtid') != null || localStorage.getItem('vat') != null) {
          this.callapi.addSell(this.formDataSell.value).subscribe(i => {
            console.log("เพิ่มสำเร็จ");
            localStorage.removeItem('custommer')
            localStorage.removeItem("countItemInList")
            localStorage.removeItem("multiListSellItem")
            this.formShowSellDone.reciveMoney = this.forMatchCurrency.format(this.formDataSell.value.receiveMoney)
            this.formShowSellDone.totalPrice = this.forMatchCurrency.format(this.formDataSell.value.totalPrice)
            this.formShowSellDone.changeMoney = this.forMatchCurrency.format(this.formDataSell.value.changeMoney)
            Swal.fire({
              showConfirmButton: true,
              confirmButtonText: 'สร้างPDF',
              html: `<h1 style="font-size:36px; padding-bottom:10px"> เงินที่ได้รับ </h1>
          <h1 style="color: blue; font-size:56px; text-align:right">${this.formShowSellDone.reciveMoney} บาท</h1>
          <h1 style="font-size:36px; padding-bottom:10px">ราคาสินค้ารวม </h1>
          <h1 style="color: blue; font-size:56px; text-align:right">${this.formShowSellDone.totalPrice} บาท</h1>
          <h1 style="font-size:36px; padding-bottom:10px"> เงินทอน </h1>
         <h1 style="color: blue; font-size:56px; text-align:right">${this.formShowSellDone.changeMoney} บาท</h1>`,
            }).then((result) => {
              if (result.isConfirmed) {
                this.genPDF(this.formDataSell.value);
              }
            })
            this.clearListSellItem()
          })
        } else if (localStorage.getItem('idsell') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดรหัสการขาย',
            icon: 'warning',
            showConfirmButton: true
          })
        } else if (localStorage.getItem('shopname') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดชื่อร้าน',
            icon: 'warning',
            showConfirmButton: true
          })
        } else if (localStorage.getItem('txtid') == null) {
          Swal.fire({
            text: 'กรุณาไปหน้าตั้งค่าเพื่อกำหนดรหัสผู้เสียภาษี',
            icon: 'warning',
            showConfirmButton: true
          })
        }
      } else {
        Swal.fire({
          text: 'จำนวนเงินผิดพลาด',
          icon: 'warning',
          timer: 1000,
          showConfirmButton: false
        })
      }
    } else {
      Swal.fire({
        text: 'รายการสินค้าไม่ถูกต้อง',
        timer: 1000,
        icon: 'error',
        showConfirmButton: false
      })
    }
  }


  changeMoney() {
    this.formDataSell.value.perDiscount = parseInt(this.formdiscount.value.perDiscount)
    this.formDataSell.value.discount = parseInt(this.formdiscount.value.discount)
    this.formDataSell.value.receiveMoney = parseInt(this.formdiscount.value.receiveMoney)
    this.submitRecive = true
    if (this.formDataSell.value.receiveMoney > 0) {
      if (this.formDataSell.value.discount > 0) {
        this.formDataSell.value.changeMoney = this.formDataSell.value.receiveMoney - (this.formDataSell.value.totalPrice - this.formDataSell.value.discount)
      }
      else if (this.formDataSell.value.perDiscount > 0) {
        this.formDataSell.value.changeMoney = this.formDataSell.value.receiveMoney - (this.formDataSell.value.totalPrice - ((this.formDataSell.value.totalPrice * this.formDataSell.value.perDiscount) / 100))
      }
      else { this.formDataSell.value.changeMoney = this.formDataSell.value.receiveMoney - this.formDataSell.value.totalPrice }
    }
  }

  clearListSellItem() {
    this.multiListSellItem = []
    this.formdiscount.patchValue({
      receiveMoney: 0,
      discount: 0,
      perDiscount: 0,
    })
    this.formCustomer.patchValue({
      customerId: null
    })
    this.dataCustomerById = null
    this.submitRecive = false
    this.countItemInList = 0
    this.formDataSell.value.totalPrice = 0
    this.formDataSell.value.netPrice = 0
    this.formDataSell.value.receiveMoney = 0
    this.formDataSell.value.changeMoney = 0
    this.formDataSell.value.discount = 0
    this.formDataSell.value.perDiscount = 0
    localStorage.removeItem('custommer')
    localStorage.removeItem("countItemInList")
    console.log(this.multiListSellItem);
  }

  findCuntomer() {
    this.callapi.getCustomerByID(this.formCustomer.value.customerId).subscribe(data => {
      this.dataCustomerById = data
      localStorage.setItem('custommer', this.dataCustomerById.customerId)
      console.log(this.dataCustomerById);
    }, error => {
      Swal.fire({
        text: 'ไม่พบรหัสลูกค้า',
        icon: 'error',
        timer: 1000,
        showConfirmButton: false
      })
    })
  }

  submitIdproduct() {
    console.log("product ID = " + this.formProduct.value.productId);
    this.getDataProductById(this.formProduct.value.productId)
    this.formProduct.patchValue({
      productId: null
    })
  }

  selectEvent(item : product) {
    console.log("product ID = " + item.productId);
    this.getDataProductById(item.productId)
    this.formProduct.patchValue({
      productId: null
    })
  }


  enterAmount(i: string) {
    this.formDataSell.value.netPrice -= this.multiListSellItem[i].totalPrice
    this.multiListSellItem[i].amount = parseInt(this.multiListSellItem[i].amount)
    this.formDataSell.value.totalPrice -= this.multiListSellItem[i].totalPrice
    this.multiListSellItem[i].totalPrice = this.multiListSellItem[i].amount * this.multiListSellItem[i].price
    this.formDataSell.value.netPrice += this.multiListSellItem[i].totalPrice
    this.formDataSell.value.totalPrice = parseInt(this.formDataSell.value.netPrice + (this.formDataSell.value.netPrice * this.formDataSell.value.vat) / 100)
    console.log(this.multiListSellItem[i].totalPrice);
  }

  genPDF(sell: sell) {
    var doc = {
      pageSize: {
        width: 219.21,
        height: 'auto'
      },
      content: [
        { text: '3MeeSHOP', style: 'header', alignment: 'center', fontSize: 16, margin: [0, -30, 0, 10] },
        { text: moment(sell.creationDatetime).format('DD/MM/YYYY'), alignment: 'left', margin: [-13, -10, 0, 10] },
        { text: moment(sell.creationDatetime).format('HH:mm'), alignment: 'right', margin: [0, -24, -13, 10] },
        {
          columns: [
            [
              { text: `ไอดีการขาย : `, margin: [-13, 0, 0, 0] },
              { text: `ชื่อร้าน : `, margin: [-13, 0, 0, 0] },
              { text: `ชื่อพนักงานขาย : `, margin: [-13, 0, 0, 0] },
              { text: `รหัสผู้เสียภาษี : `, margin: [-13, 0, 0, 10] }
            ], [
              { text: `${sell.sellId}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${sell.shopName}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${sell.customerStoreName}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: ` ${sell.taxId}`, alignment: 'right', margin: [0, 0, -13, 10] }
            ]
          ]
        },
        {
          columns: [
            [
              { text: '-----------------------------------------------------------------------------', margin: [-30, 0, 0, 0] }
            ]
          ]
        }
      ],
      styles: {
        arguments: 'left',
        fontSize: 18,
        bold: true,
        background: '#ff1'
      },
      defaultStyle: {
        font: 'THSarabunNew'
      }
    };
    for (let i = 0; i < sell.listSellItem.length; i++) {

      doc.content.push({
        columns: [
          [
            { text: sell.listSellItem[i].productName, margin: [-30, 0, 0, 0], alignment: 'left' }
          ],
          [
            { text: sell.listSellItem[i].amount.toString(), alignment: 'right', margin: [0, 0, 0, 0] }
          ],
          [
            { text: sell.listSellItem[i].price.toString(), margin: [35, 0, 0, 0], alignment: 'right' }
          ],
        ]
      })
    }
    doc.content.push({
      columns: [
        [
          { text: '-----------------------------------------------------------------------------', margin: [-30, 0, 0, 10] }
        ]
      ]
    }, {
      columns: [
        [
          { text: `ราคารวม : `, margin: [-13, 0, 0, 0] },
          { text: `ภาษี :`, margin: [-13, 0, 0, 0] },
          { text: `ราคาภาษี :`, margin: [-13, 0, 0, 0] },
          { text: `ลดราคาพิเศษ : `, margin: [-13, 0, 0, 0] },
          { text: `ลดราคา : `, margin: [-13, 0, 0, 0] },
          { text: `เงินที่รับ : `, margin: [-13, 0, 0, 0] },
          { text: `เงินทอน : `, margin: [-13, 0, 0, 0] },
        ],
        [
          { text: `${sell.totalPrice}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.vat} %`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.netPrice}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.discount}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.perDiscount} %`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.receiveMoney}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${sell.changeMoney}`, alignment: 'right', margin: [0, 0, -13, 0] },
        ]
      ]
    })
    pdfMake.createPdf(doc).open()
  }

  getDataProductById(id: string) {
    this.listSellItem = {
      productId: null,
      productName: null,
      price: null,
      amount: null,
      totalPrice: null
    }
    this.formdiscount.patchValue({
      discount: 0,
      perDiscount: 0
    })

    if (this.dataCustomerById != null) {
      this.callapi.getProductByID(id).subscribe(data => {
        this.listSellItem.productId = data.productId
        this.listSellItem.productName = data.productName
        if (this.dataCustomerById.type == 'standard') { this.listSellItem.price = data.price1 }
        else if (this.dataCustomerById.type == 'member') { this.listSellItem.price = data.price2 }
        else if (this.dataCustomerById.type == 'vip') { this.listSellItem.price = data.price3 }
        this.listSellItem.amount = 1
        this.listSellItem.totalPrice = this.listSellItem.amount * this.listSellItem.price

        this.product.push(data)
        console.log("product :", this.product);
        console.log(data);

        this.multiListSellItem.push(this.listSellItem)
        console.log("list:", this.listSellItem);
        console.log("multilist :", this.multiListSellItem);

        this.formDataSell.value.netPrice += this.multiListSellItem[this.countItemInList].totalPrice
        this.formDataSell.value.totalPrice = parseInt(this.formDataSell.value.netPrice + (this.formDataSell.value.netPrice * this.formDataSell.value.vat) / 100)
        this.countItemInList += 1
        console.log("total : ", this.formDataSell.value.totalPrice);

      },error => {
        Swal.fire({
          title:'รหัสสินค้าไม่ตรง',
          timer:500,
          icon:'warning',
          showConfirmButton:false
        })
      })
    } else {
      Swal.fire({
        title: 'กรุณากรอกรหัสลูกค้า',
        icon: 'warning',
        timer: 1000,
        showConfirmButton: false
      })
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('rankuser') == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
    if (localStorage.getItem('custommer') != null) {
      this.callapi.getCustomerByID(localStorage.getItem('custommer')).subscribe(data => {
        this.dataCustomerById = data
        this.formCustomer.patchValue({
          customerId: this.dataCustomerById.customerId
        })
        console.log(this.dataCustomerById);
      })
    }
    this.callapi.getUserByID(localStorage.getItem('iduser')).subscribe(data => {
      this.dataUserById = data
    })
    this.formdiscount.value.discount = 0
    this.formdiscount.value.perDiscount = 0
    this.formDataSell.value.vat = 0
    if (localStorage.getItem('idsell') == null || localStorage.getItem('shopname') == null || localStorage.getItem('txtid') == null || localStorage.getItem('vat') == null) {
      Swal.fire({
        title: 'กรุณาตั้งค่าก่อนเริ่มการขาย',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'ไปยังหน้าตั้งค่า',
        confirmButtonColor: '#313131',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCloseButton: false,
        preConfirm: () => {
          localStorage.setItem('index', '7')
          this.router.navigateByUrl('/setting')

          // ยังไม่ได้ใช้   setvat ตอนเริ่มต้น   //
          // if (!vat) {
          //   Swal.showValidationMessage(
          //     '<i class="fa fa-info-circle"></i> กรุณากรอก  % Vat '
          //   )
          // } else {
          //   let isnum = /^\d+$/.test(vat)
          //   if (isnum == true) {
          //     this.formDataSell.value.vat = parseInt(vat)
          //     localStorage.setItem('vat', vat)
          //     Swal.fire({
          //       position: 'center',
          //       icon: 'success',
          //       title: 'บันทึกเรียบร้อย',
          //       showConfirmButton: false,
          //       timer: 1000
          //     })
          //   } else {
          //     Swal.showValidationMessage(
          //       '<i class="fa fa-info-circle"></i> กรุณากรอกเฉพาะตัวเลข '
          //     )
          //   }
          // }
        }
      })
    } else {
      this.formDataSell.value.vat = parseInt(localStorage.getItem('vat'))
    }

    this.callapi.getAllProduct().subscribe(data=>{
      this.dataProductAll = data;
    })
  }






}
