import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { HomeComponent } from './common/home/home.component';
import { BirthdayComponent } from './modules/birthday/birthday.component';
import { DayInHistoryComponent } from './modules/day-in-history/day-in-history.component';
import { CelebrityComponent } from './modules/celebrity/celebrity.component';
import { InfoSidebarComponent } from './modules/info-sidebar/info-sidebar.component';
import { FrontFeatureComponent } from './components/front-feature/front-feature.component';
import { FrontFeatureCardComponent } from './components/front-feature/front-feature-card/front-feature-card.component';
import { GeneralService } from './services/general.service';
import { TvEffectComponentComponent } from './components/tv-effect-component/tv-effect-component.component';
import { FooterComponent } from './common/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BirthdayComponent,
    DayInHistoryComponent,
    CelebrityComponent,
    InfoSidebarComponent,
    FrontFeatureComponent,
    FrontFeatureCardComponent,
    TvEffectComponentComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
