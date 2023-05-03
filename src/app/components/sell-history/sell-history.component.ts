import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sell } from 'src/app/models/sell';
import { CallApiService } from 'src/app/services/call-api.service';
import { Router } from '@angular/router';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from 'pdfmake/build/pdfMake'
import * as moment from 'moment';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-sell-history',
  templateUrl: './sell-history.component.html',
  styleUrls: ['./sell-history.component.css']
})
export class SellHistoryComponent implements OnInit {

  dataUser: any
  picker: any
  searchText: any
  getAllSell: any
  showbill: any
  filterDate: any
  timeStart: any
  timeEnd: any
  dateRage = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  })
  config = {
    itemsPerPage: 7,
    currentPage: 0
  }

  constructor(public callapi: CallApiService, public router: Router) {
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

  ngOnInit(): void {
    this.getDataAllSell()
    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
  }

  onPageChage(event: any) {
    console.log(event)
    this.config.currentPage = event
  }

  showBill(id: string) {
    this.callapi.getSellByID(id).subscribe(data => {
      this.showbill = data
      console.log(this.showbill);
    })
  }


  findDate() {
    if (this.dateRage.value.start != null && this.dateRage.value.end != null) {
      this.callapi.getSellByRangeDate(this.dateRage.value.start.toUTCString(), this.dateRage.value.end.toUTCString()).subscribe(data => {
        this.getAllSell = data
      })
    } else if (this.dateRage.value.start != null) {
      this.callapi.getSellByDate(this.dateRage.value.start.toUTCString()).subscribe(data => {
        this.getAllSell = data
      })
    }
  }

// pdf
  genPDF(bill: sell) {
    var doc = {
      pageSize: {
        width: 219.21,
        height: 'auto'
      },
      content: [
        { text: '3MeeSHOP', style: 'header', alignment: 'center', fontSize: 16, margin: [0, -30, 0, 10] },
        { text:moment(bill.creationDatetime).format('DD/MM/YYYY') , alignment: 'left', margin: [-13, -10, 0, 10] },
        { text:moment(bill.creationDatetime).format('HH:mm') , alignment: 'right',  margin: [0, -24, -13, 10] },
        {
          columns: [
            [
              { text: `ไอดีการขาย : `, margin: [-13, 0, 0, 0] },
              { text: `ชื่อร้าน : `, margin: [-13, 0, 0, 0] },
              { text: `ชื่อพนักงานขาย : `, margin: [-13, 0, 0, 0] },
              { text: `รหัสผู้เสียภาษี : `, margin: [-13, 0, 0, 10] }
            ], [
              { text: `${bill.sellId}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${bill.shopName}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: `${bill.customerStoreName}`, alignment: 'right', margin: [0, 0, -13, 0] },
              { text: ` ${bill.taxId}`, alignment: 'right', margin: [0, 0, -13, 10] }
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
    for (let i = 0; i < bill.listSellItem.length; i++) {

      doc.content.push({
        columns: [
          [
            { text: bill.listSellItem[i].productName, margin: [-30, 0, 0, 0], alignment: 'left' }
          ],
          [
            { text: bill.listSellItem[i].amount.toString(), alignment: 'right', margin: [0, 0, 0, 0] }
          ],
          [
            { text: bill.listSellItem[i].price.toString(), margin: [35, 0, 0, 0], alignment: 'right' }
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
          { text: `${bill.totalPrice}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.vat} %`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.netPrice}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.discount}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.perDiscount} %`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.receiveMoney}`, alignment: 'right', margin: [0, 0, -13, 0] },
          { text: `${bill.changeMoney}`, alignment: 'right', margin: [0, 0, -13, 0] },
        ]
      ]
    })
    pdfMake.createPdf(doc).open()
  }

  getDataAllSell() {
    this.callapi.getAllSell().subscribe(data => {
      this.getAllSell = data
      console.log(this.getAllSell);
    })
  }
}
