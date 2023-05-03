import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-manager-dailyincome',
  templateUrl: './manager-dailyincome.component.html',
  styleUrls: ['./manager-dailyincome.component.css']
})

export class ManagerDailyincomeComponent implements OnInit {

  favoriteSeason: string;
  seasons: string[] = ['รายรับวันนี้', 'รายจ่ายวันนี้', 'รายรับเดือนนี้', 'รายจ่ายเดือนนี้'];
  tabs = ['หน้าแรก'];
  selected = new FormControl(0);

 

  addTab(selectAfterAdding: boolean) {
      this.tabs.push(this.favoriteSeason);
    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }
  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  ngOnInit(): void {
  }

}
