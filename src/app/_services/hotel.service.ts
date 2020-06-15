import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HotelModel} from '../_models/hotel.model';
import {HttpClient} from '@angular/common/http';
import {TrackModel} from '../_models/track.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  trackData: BehaviorSubject<TrackModel[]>;
  trackDataObserver: Observable<TrackModel[]>;

  constructor(private httpClient: HttpClient) {
    // Initiate Track Data
    this.trackData = new BehaviorSubject<TrackModel[]>([]);
    this.trackDataObserver = this.trackData.asObservable();
  }

  getAllHotels(): Observable<HotelModel[]> {
    return this.httpClient.get<HotelModel[]>('assets/hotels.json');
  }

  updateTrackData(hotelId: number, updateCriterion: string) {
    // Get data for the hotel
    const data = this.trackData.getValue();
    const hotelInIndex = data.findIndex(d => d.hotelId === hotelId);
    if (hotelInIndex !== -1) {
      data[hotelInIndex].trackData[updateCriterion] += 1;
      this.trackData.next(data);
      return;
    }
    // Initiate Track Data for the Hotel
    const newHotel: TrackModel = {
      hotelId,
      trackData: { viewCount: 0, draftsCount: 0, bookingCount: 0 }
    };
    // Increment the criterion
    newHotel.trackData[updateCriterion] += 1;
    // Push this new hotel to track list
    data.push(newHotel);
    this.trackData.next(data);
  }
}
