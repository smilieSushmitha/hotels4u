import {Component, OnDestroy, OnInit} from '@angular/core';
import {HotelService} from '../_services/hotel.service';
import {Subscription} from 'rxjs';
import {HotelModel} from '../_models/hotel.model';
import {TrackModel} from '../_models/track.model';
import {PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit, OnDestroy {
  rawHotels: HotelModel[];
  hotels: HotelModel[];
  recommendations: HotelModel[];
  totalHotels: number;
  subscriptions: Subscription[] = [];
  constructor(private router: Router,
              private hotelService: HotelService) {
    this.hotels = [];
    this.recommendations = [];
  }

  ngOnInit(): void {
    this.loadHotels();
    this.loadRecommendations();
  }

  loadHotels() {
    this.subscriptions[0] = this.hotelService
      .getAllHotels()
      .subscribe(res => {
        this.rawHotels = res;
        this.totalHotels = this.rawHotels.length;
        this.hotels = res.slice(0, 10);
      }, err => {
        console.error(err);
      });
  }

  loadRecommendations() {
    this.subscriptions[1] = this.hotelService
      .recommendationsObserver
      .subscribe(res => {
        this.recommendations = res.slice(0, 10);
      }, err => {
        console.error(err);
      });
  }

  onHotelClicked(hotelId: number) {
    // Increase view count
    this.hotelService
      .updateTrackData(hotelId, 'viewCount');
    // Now navigate to hotel page
    this.router.navigate([hotelId]).then(r => null);
  }

  onPageChange(page: PageEvent) {
    const startIndex = page.pageIndex * page.pageSize;
    const endIndex = startIndex + page.pageSize;
    this.hotels = this.rawHotels.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
