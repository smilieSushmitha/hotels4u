import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatDatepickerModule,
  ]
})
export class SharedModule { }
