import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HotelModel} from '../_models/hotel.model';
import {HttpClient} from '@angular/common/http';
import {TrackModel} from '../_models/track.model';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotels: BehaviorSubject<HotelModel[]>;
  trackData: BehaviorSubject<TrackModel[]>;
  trackDataObserver: Observable<TrackModel[]>;
  recommendations: BehaviorSubject<HotelModel[]>;
  recommendationsObserver: Observable<HotelModel[]>;

  constructor(private httpClient: HttpClient) {
    this.hotels = new BehaviorSubject<HotelModel[]>([]);
    // Initiate Track Data
    this.trackData = new BehaviorSubject<TrackModel[]>([]);
    this.trackDataObserver = this.trackData.asObservable();
    // Initiate Hotel Recommendation
    this.recommendations = new BehaviorSubject<HotelModel[]>([]);
    this.recommendationsObserver = this.recommendations.asObservable();
  }

  getAllHotels(): Observable<HotelModel[]> {
    return this.httpClient.get<HotelModel[]>('assets/hotels.json')
      .pipe(tap(data => this.hotels.next(data)));
  }

  getHotelById(hotelId: number): Observable<HotelModel> {
    return this.httpClient.get<HotelModel[]>('assets/hotels.json')
      .pipe(map(res => res.find(hotel => hotel.hotelId === hotelId)));
  }

  updateTrackData(hotelId: number, updateCriterion: string) {
    // Get data for the hotel
    const data = this.trackData.getValue();
    const hotelInIndex = data.findIndex(d => d.hotelId === hotelId);
    if (hotelInIndex !== -1) {
      data[hotelInIndex].trackData[updateCriterion] += 1;
      this.trackData.next(data);
      this.refreshRecommendation();
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
    this.refreshRecommendation();
  }

  refreshRecommendation() {
    // First get tracking data for hotels
    const data = this.trackData.getValue();
    // Find out the hotel viewed most
    const trackedHotel = data.reduce((prev, current) =>
      (prev.trackData.viewCount > current.trackData.viewCount) ? prev : current);
    // Find the hotel Object
    const hotel = this.hotels.getValue()
      .find(h => h.hotelId === trackedHotel.hotelId);
    // Now we got the Hotel that is most viewed
    // Adding recommendation criteria as regionName and fall back as regionParent
    let filteredHotels = this.hotels.getValue()
      .filter(h => h.regionName === hotel.regionName ||
        h.regionParent === hotel.regionParent);
    // Remove the hotel already viewed
    filteredHotels = filteredHotels.filter(h => h.hotelId !== hotel.hotelId);
    // Sorting filteredHotel by price low to high
    const recommendations = filteredHotels.sort((a, b) =>
      (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
    // Emit the recommendations
    this.recommendations.next(recommendations);
  }
}
