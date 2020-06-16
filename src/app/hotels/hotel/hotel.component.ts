import {Component, OnDestroy, OnInit} from '@angular/core';
import {HotelModel} from '../../_models/hotel.model';
import {TrackModel} from '../../_models/track.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HotelService} from '../../_services/hotel.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit, OnDestroy {
  hotelId: number;
  showBookForm: boolean;
  bookFormGroup: FormGroup;
  minDate: Date;
  hotel: HotelModel;
  trackData: TrackModel;
  subscriptions: Subscription[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private hotelService: HotelService) {
    this.showBookForm = false;
    this.minDate = new Date();
    this.hotelId = parseInt(this.activatedRoute.snapshot.params.hotelId, 10);
    this.trackData = {
      hotelId: this.hotelId,
      trackData: { viewCount: 0, draftsCount: 0, bookingCount: 0 }
    };
    this.bookFormGroup = this.formBuilder.group({
      hotel: ['', Validators.required],
      rooms: [1, Validators.required],
      adults: [2, Validators.required],
      children: [0],
      checkIn: [null, Validators.required],
      checkOut: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadHotel();
    this.loadTrackData();
  }

  loadHotel() {
    this.subscriptions[0] = this.hotelService
      .getHotelById(this.hotelId)
      .subscribe(res => {
        this.hotel = res;
        this.bookFormGroup.patchValue({hotel: this.hotel.hotelName});
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

  onBookClicked() {
    // Increase draft count
    this.hotelService
      .updateTrackData(this.hotelId, 'draftsCount');
    this.showBookForm = true;
  }

  onBookingConfirmed() {
    // Increase booking count
    this.hotelService
      .updateTrackData(this.hotelId, 'bookingCount');
    this.showBookForm = false;
    console.log(this.bookFormGroup.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }
}
