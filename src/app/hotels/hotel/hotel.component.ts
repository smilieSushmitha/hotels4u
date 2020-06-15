import {Component, OnDestroy, OnInit} from '@angular/core';
import {HotelModel} from '../../_models/hotel.model';
import {TrackModel} from '../../_models/track.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HotelService} from '../../_services/hotel.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit, OnDestroy {
  hotelId: number;
  hotel: HotelModel;
  trackData: TrackModel;
  subscriptions: Subscription[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private hotelService: HotelService) {
    this.hotelId = parseInt(this.activatedRoute.snapshot.params.hotelId, 10);
    this.trackData = {
      hotelId: this.hotelId,
      trackData: { viewCount: 0, draftsCount: 0, bookingCount: 0 }
    };
  }

  ngOnInit(): void {
    this.loadHotel();
    this.loadTrackData();
  }

  loadHotel() {
    this.subscriptions[0] = this.hotelService
      .getAllHotels()
      .subscribe(res => {
        this.hotel = res.find(h => h.hotelId = this.hotelId);
      }, err => {
        console.error(err);
      });
  }

  loadTrackData() {
    this.subscriptions[1] = this.hotelService
      .trackDataObserver
      .subscribe(res => {
        const trackIndex = res.findIndex(t => t.hotelId === this.hotelId);
        if (trackIndex !== -1) {
          this.trackData = res[trackIndex];
        }
      }, err => {
        console.error(err);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
