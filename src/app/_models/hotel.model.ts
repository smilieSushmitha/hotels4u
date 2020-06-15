export interface HotelModel {
  hotelId: number;
  hotelName: string;
  street: string;
  zip: number;
  regionId: number;
  regionName: string;
  regionParent: string;
  countryName: string;
  latitude: number;
  longitude: number;
  rating: number;
  photoUrl: string;
  price: number;
}
