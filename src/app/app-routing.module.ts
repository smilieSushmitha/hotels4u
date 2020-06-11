import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HotelsComponent} from "./hotels/hotels.component";


const routes: Routes = [{
  path: '', component: HotelsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
