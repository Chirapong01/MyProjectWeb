import { listSellItem } from './../../models/sell';
import { product } from './../../models/product';
import { listProduct } from './../../models/stock';
import { CallApiService } from './../../services/call-api.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})

export class ManagerDashboardComponent implements OnInit {
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  chooseOption: string;
  option: string[] = [
    'สินค้าที่ขายวันนี้',
    'สินค้าที่ขายเดือนนี้',
    'ประวัติการขายทั้งหมด',
  ];
  statusTab: number;
  tabs = ['ประวัติการขายทั้งหมด'];
  selected = new FormControl();
  searchText: any;

  panelOpenState = false;


  dataUser: any
  formFindDate: any;
  formFindMonth: any;
  formFindYear: any;

  myChart: any;
  myChart2: any;
  income: any = 0;
  cost: any = 0;
  result: any = 0;
  getAllSell: any;
  getAllSellByDate: any[] = [];
  getAllSellByMonth: any;
  getAllSellToChooseDate: any[] = [];

  getDataProduct: any;
  getPriceProduct: product[] = [];
  getPriceStockStepTwo: product[] = [];
  countPriceStock: number;

  counterItem: number = 0;
  getIncomeData: any;
  getCost: any;
  getProduct: product[] = [];
  getIncomePrice: listProduct[] = [];
  listItem: listSellItem[] = [];
  bestSeller: listSellItem[] = [];
  bestSeller2: any[] = [];
  tableTotalPriceBar: listSellItem[] = [];
  tableTotalPriceLine: listSellItem[] = [];
  totalPriceShow: listSellItem[] = [];

  data: any[] = [];
  labelProduct: any[] = [];
  nameProduct: any[] = [];
  amountProduct: any[] = [];
  dataProduct: listSellItem[] = [];

  labelProductResult: any[] = [];
  dataProductResult: any[] = [];

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public callapi: CallApiService,

  ) {
    (this.formFindDate = this.fb.group({
      dateStart: null,
      dateEnd: null,
    })),
      (this.formFindMonth = this.fb.group({
        monthStart: null,
        monthEnd: null,
      })),
      (this.formFindYear = this.fb.group({
        yearStart: null,
        yearEnd: null,
      }));
  }

  config = {
    itemsPerPage: 6,
    currentPage: 0,
  };

  onPageChange(event) {
    this.config.currentPage = event;
  }


  onGetAll() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    this.callapi.getAllSell().subscribe((i) => {
      this.getAllSell = i;
      this.getAllSellByDate[0] = i;
      for (let i = 0; i < this.getAllSell.length; i++) {
        for (let index = 0; index < this.getAllSell[i].listSellItem.length; index++) {
          this.listItem.push(this.getAllSell[i].listSellItem[index]);
        }
      }
      for (let i = 0; i < this.getAllSellByDate[0].length; i++) {
        for (let index = 0; index < this.getAllSellByDate[0][i].listSellItem.length; index++) {
          let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[0][i].listSellItem[index].productId)
          if (checkId == null) {
            this.dataProduct.push(this.getAllSellByDate[0][i].listSellItem[index]);

          } else {

            for (let j = 0; j < this.dataProduct.length; j++) {
              if (this.dataProduct[j].productId == this.getAllSellByDate[0][i].listSellItem[index].productId) {
                this.dataProduct[j].amount += this.getAllSellByDate[0][i].listSellItem[index].amount;
                this.dataProduct[j].totalPrice += this.getAllSellByDate[0][i].listSellItem[index].totalPrice;
              }

            }
          }
        }
      }
      for (let k = 0; k < this.dataProduct.length; k++) {
        this.nameProduct.push(this.dataProduct[k].productName)
        this.amountProduct.push(this.dataProduct[k].amount)
      }
      // this.chartResult();
      this.productBestSeller();
    });
  }

  productBestSeller() {
    this.bestSeller = []
    let date = new Date();
    this.formFindMonth.value.monthStart = new Date();
    this.formFindMonth.value.monthEnd = new Date();
    this.formFindMonth.value.monthStart.setDate(1);
    this.formFindMonth.value.monthStart.setHours(0);
    this.formFindMonth.value.monthStart.setMinutes(0);
    this.formFindMonth.value.monthStart.setSeconds(0);
    this.formFindMonth.value.monthEnd.setMonth(date.getMonth() + 1);
    this.formFindMonth.value.monthEnd.setDate(1);
    this.formFindMonth.value.monthEnd.setHours(0);
    this.formFindMonth.value.monthEnd.setMinutes(0);
    this.formFindMonth.value.monthEnd.setSeconds(0);
    console.log('--------', this.formFindMonth.value.month);
    this.callapi.getSellByMonth(
      this.formFindMonth.value.monthStart.toUTCString(),
      this.formFindMonth.value.monthEnd.toUTCString()).subscribe((i) => {
        this.getAllSellByMonth = i;
        for (let i = 0; i < this.getAllSellByMonth.length; i++) {
          for (let index = 0; index < this.getAllSellByMonth[i].listSellItem.length; index++) {
            let checkId = this.bestSeller.find(sum => sum.productId == this.getAllSellByMonth[i].listSellItem[index].productId)
            if (checkId == null) {
              this.bestSeller.push(this.getAllSellByMonth[i].listSellItem[index]);
              console.log(this.bestSeller);
            } else {
              for (let j = 0; j < this.bestSeller.length; j++) {
                if (this.bestSeller[j].productId == this.getAllSellByMonth[i].listSellItem[index].productId) {
                  this.bestSeller[j].amount += this.getAllSellByMonth[i].listSellItem[index].amount;
                  this.bestSeller.sort((a, b) => b.amount - a.amount);
                }
              }
            }
          }
        }
      });
  }

  dailyIncome() {
    this.formFindDate.value.dateStart = new Date();
    this.formFindDate.value.dateEnd = new Date();
    this.formFindDate.value.dateStart.setHours(0);
    this.formFindDate.value.dateStart.setMinutes(0);
    this.formFindDate.value.dateStart.setSeconds(1);
    this.formFindDate.value.dateEnd.setHours(23);
    this.formFindDate.value.dateEnd.setMinutes(59);
    this.formFindDate.value.dateEnd.setSeconds(59);
    if (this.formFindDate != null) {
      this.callapi.getSellByRangeDate(
        this.formFindDate.value.dateStart.toUTCString(),
        this.formFindDate.value.dateEnd.toUTCString()
      )
        .subscribe((data) => {
          this.getIncomeData = data;
          for (let i = 0; i < this.getIncomeData.length; i++) {
            for (let index = 0; index < this.getIncomeData[i].listSellItem.length; index++) {
              this.getIncomePrice.push(this.getIncomeData[i].listSellItem[index]);
              this.income += this.getIncomeData[i].listSellItem[index].totalPrice;
              this.counterItem += 1;
            }
          }
          this.dailyCost();
        });
    }
  }

  dailyCost() {
    this.callapi.getAllProduct().subscribe(data => {
      this.getDataProduct = data;
      if (this.getDataProduct != undefined) {
        for (let data = 0; data < this.getDataProduct.length; data++) {
          for (let index = 0; index < this.getIncomePrice.length; index++) {
            if (this.getDataProduct[data].productId == this.getIncomePrice[index].productId) {
              this.cost += (this.getDataProduct[data].costAvg * this.getIncomePrice[index].amount);
            }
          }
        }
      }
    });
  }

  addTab() {
    this.tabs.fill(this.chooseOption);
    if (this.chooseOption == 'ประวัติการขายทั้งหมด') {
      this.statusTab = 0;
      this.onGetAll();
      this.selected.setValue(this.tabs.length);
    } else if (this.chooseOption == 'สินค้าที่ขายวันนี้') {
      this.statusTab = 1;
      this.findDate();
      this.selected.setValue(this.tabs.length);
    } else if (this.chooseOption == 'สินค้าที่ขายเดือนนี้') {
      this.statusTab = 2;
      this.findMonth();
      this.selected.setValue(this.tabs.length);
    }

  }
  findDatePicker() {
    if (this.dateRange.value.start != null && this.dateRange.value.end != null) {
      this.callapi.getSellByRangeDate(this.dateRange.value.start.toUTCString(), this.dateRange.value.end.toUTCString()).subscribe((data) => {
        this.getAllSellByDate[0] = data;
        console.log(this.getAllSellByDate[0]);
      });
    } else if (this.dateRange.value.start != null) {
      this.callapi.getSellByDate(this.dateRange.value.start.toUTCString()).subscribe((data) => {
        this.getAllSellByDate[0] = data;
      });
    }

  }

  findDate() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    this.formFindDate.value.dateStart = new Date();
    this.formFindDate.value.dateEnd = new Date();
    this.formFindDate.value.dateStart.setHours(0);
    this.formFindDate.value.dateStart.setMinutes(0);
    this.formFindDate.value.dateStart.setSeconds(1);
    this.formFindDate.value.dateEnd.setHours(23);
    this.formFindDate.value.dateEnd.setMinutes(59);
    this.formFindDate.value.dateEnd.setSeconds(59);
    if (this.formFindDate != null) {
      this.callapi
        .getSellByRangeDate(
          this.formFindDate.value.dateStart.toUTCString(),
          this.formFindDate.value.dateEnd.toUTCString()
        )
        .subscribe((data) => {
          console.log('findDate', this.formFindDate.value);
          this.getAllSellByDate[1] = data
          for (let i = 0; i < this.getAllSellByDate[1].length; i++) {
            for (let index = 0; index < this.getAllSellByDate[1][i].listSellItem.length; index++) {
              let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[1][i].listSellItem[index].productId)
              if (checkId == null) {
                this.dataProduct.push(this.getAllSellByDate[1][i].listSellItem[index]);
                console.log(this.dataProduct);

              } else {
                for (let j = 0; j < this.dataProduct.length; j++) {
                  if (this.dataProduct[j].productId == this.getAllSellByDate[1][i].listSellItem[index].productId) {
                    this.dataProduct[j].amount += this.getAllSellByDate[1][i].listSellItem[index].amount
                    this.dataProduct[j].totalPrice += this.getAllSellByDate[1][i].listSellItem[index].totalPrice;
                  }
                }
              }
            }
          }

          for (let k = 0; k < this.dataProduct.length; k++) {
            this.nameProduct.push(this.dataProduct[k].productName)
            this.amountProduct.push(this.dataProduct[k].amount)
          }
        });


    }
  }

  findMonth() {
    this.nameProduct = []
    this.dataProduct = []
    this.amountProduct = []
    let date = new Date();
    this.formFindMonth.value.monthStart = new Date();
    this.formFindMonth.value.monthEnd = new Date();
    this.formFindMonth.value.monthStart.setDate(1);
    this.formFindMonth.value.monthStart.setHours(0);
    this.formFindMonth.value.monthStart.setMinutes(0);
    this.formFindMonth.value.monthStart.setSeconds(0);
    this.formFindMonth.value.monthEnd.setMonth(date.getMonth() + 1);
    this.formFindMonth.value.monthEnd.setDate(1);
    this.formFindMonth.value.monthEnd.setHours(0);
    this.formFindMonth.value.monthEnd.setMinutes(0);
    this.formFindMonth.value.monthEnd.setSeconds(0);
    console.log('--------', this.formFindMonth.value.month);
    if (this.formFindMonth != null) {
      this.callapi.getSellByMonth(
        this.formFindMonth.value.monthStart.toUTCString(),
        this.formFindMonth.value.monthEnd.toUTCString()).subscribe((data) => {
          console.log('findMonth', this.formFindMonth.value);
          this.getAllSellByDate[2] = data;
          for (let i = 0; i < this.getAllSellByDate[2].length; i++) {
            for (let index = 0; index < this.getAllSellByDate[2][i].listSellItem.length; index++) {
              let checkId = this.dataProduct.find(sum => sum.productId == this.getAllSellByDate[2][i].listSellItem[index].productId)
              if (checkId == null) {
                this.dataProduct.push(this.getAllSellByDate[2][i].listSellItem[index]);

              } else {
                for (let j = 0; j < this.dataProduct.length; j++) {
                  if (this.dataProduct[j].productId == this.getAllSellByDate[2][i].listSellItem[index].productId) {
                    this.dataProduct[j].amount += this.getAllSellByDate[2][i].listSellItem[index].amount;
                    this.dataProduct[j].totalPrice += this.getAllSellByDate[2][i].listSellItem[index].totalPrice;
                  }
                }
              }
            }
          }
          for (let k = 0; k < this.dataProduct.length; k++) {
            this.nameProduct.push(this.dataProduct[k].productName.substring(0,))
            this.amountProduct.push(this.dataProduct[k].amount)
          }
        });
    }
  }

  // chartToday() {
  //   if (this.myChart != undefined) {
  //     this.myChart.destroy();
  //   }
  //   const ctx = document.getElementById('chartToday');
  //   this.myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: this.nameProduct,
  //       datasets: [
  //         {
  //           label: "",
  //           data: this.amountProduct,
  //           backgroundColor: [
  //             'rgba(255, 99, 132, 0.2)',
  //             'rgba(54, 162, 235, 0.2)',
  //             'rgba(255, 206, 86, 0.2)',
  //             'rgba(75, 192, 192, 0.2)',
  //             'rgba(153, 102, 255, 0.2)',
  //             'rgba(255, 159, 64, 0.2)',
  //           ],
  //           borderColor: [
  //             'rgba(255, 99, 132, 1)',
  //             'rgba(54, 162, 235, 1)',
  //             'rgba(255, 206, 86, 1)',
  //             'rgba(75, 192, 192, 1)',
  //             'rgba(153, 102, 255, 1)',
  //             'rgba(255, 159, 64, 1)',
  //           ],
  //           borderWidth: 2,
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

  // chartResult() {
  //   if (this.myChart2 != undefined) {
  //     this.myChart2.destroy();
  //   }
  //   if (this.nameProduct != [] && this.amountProduct != []) {
  //     const ctx2 = document.getElementById('chartResults');
  //     this.myChart2 = new Chart(ctx2, {
  //       type: 'line',
  //       data: {
  //         labels: this.nameProduct,
  //         datasets: [
  //           {
  //             label: "",
  //             data: this.amountProduct,
  //             backgroundColor: [
  //               'rgba(255, 99, 132, 0.2)',
  //               'rgba(54, 162, 235, 0.2)',
  //               'rgba(255, 206, 86, 0.2)',
  //               'rgba(75, 192, 192, 0.2)',
  //               'rgba(153, 102, 255, 0.2)',
  //               'rgba(255, 159, 64, 0.2)',
  //             ],
  //             borderColor: [
  //               'rgba(255, 99, 132, 1)',
  //               'rgba(54, 162, 235, 1)',
  //               'rgba(255, 206, 86, 1)',
  //               'rgba(75, 192, 192, 1)',
  //               'rgba(153, 102, 255, 1)',
  //               'rgba(255, 159, 64, 1)',
  //             ],
  //             borderWidth: 2,
  //           },
  //         ],
  //       },
  //       options: {
  //         // animations: {
  //         //   tension: {
  //         //     duration: 100,
  //         //     easing: 'linear',
  //         //     from: 1,
  //         //     to: 0,
  //         //     loop: true
  //         //   }
  //         // },
  //         scales: {
  //           y: {
  //             beginAtZero: true,
  //           },
  //         },
  //       },
  //     });
  //   }
  // }


  ngOnInit() {
    this.dailyIncome();
    this.statusTab = 0;
    this.onGetAll();

    this.dataUser = localStorage.getItem('rankuser')
    if (this.dataUser == 'SELL') {
      this.router.navigateByUrl('/sell-main')
    }
    if (this.dataUser == 'STOCK') {
      this.router.navigateByUrl('/product-detail')
    }
  }
}
