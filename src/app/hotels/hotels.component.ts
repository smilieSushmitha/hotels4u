import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: any[];
  constructor() {
    this.hotels = new Array(10).fill(0);
  }

  ngOnInit(): void {
  }

}
