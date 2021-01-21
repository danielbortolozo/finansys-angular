import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from './in-memory-database';
import { HttpClientModule } from '@angular/common/http';
import { CategoriesModule } from './pages/categories/categories.module';
import { CategoriesRoutingModule } from './pages/categories/categories-routing.module';
import { EntriesModule } from './pages/entries/entries.module';
import { EntriesRoutingModule } from './pages/entries/entries-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    CategoriesModule,
    CategoriesRoutingModule,
    EntriesModule,
    EntriesRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()   

    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
