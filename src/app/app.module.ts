import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDatabase } from './in-memory-database';
import { HttpClientModule } from '@angular/common/http';
import { CategoriesModule } from './pages/categories/categories.module';
import { CategoriesRoutingModule } from './pages/categories/categories-routing.module';



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

    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
