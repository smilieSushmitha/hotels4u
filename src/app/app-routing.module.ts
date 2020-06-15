import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HotelsComponent} from './hotels/hotels.component';
import {HotelComponent} from './hotels/hotel/hotel.component';


const routes: Routes = [
  { path: '', component: HotelsComponent },
  { path: ':hotelId', component: HotelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
