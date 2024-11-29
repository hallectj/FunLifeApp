import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { HttpClientModule, HttpClientJsonpModule, withFetch, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { BreadcrumbComponent } from './common/breadcrumb/breadcrumb.component';
import { BirthdayComponent } from './modules/birthday/birthday.component';
import { DayInHistoryComponent } from './modules/day-in-history/day-in-history.component';
import { CelebrityComponent } from './modules/celebrity/celebrity.component';
import { InfoSidebarComponent } from './modules/info-sidebar/info-sidebar.component';
import { FrontFeatureComponent } from './components/front-feature/front-feature.component';
import { FrontFeatureCardComponent } from './components/front-feature/front-feature-card/front-feature-card.component';
import { TvEffectComponentComponent } from './components/tv-effect-component/tv-effect-component.component';
import { FooterComponent } from './common/footer/footer.component';
import { PostExcerptComponent } from './components/post-excerpt/post-excerpt.component';
import { MidFeatureComponent } from './components/mid-feature/mid-feature.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { CelebCardComponent } from './modules/celebrity/celeb-card/celeb-card.component';
import { FormsModule } from '@angular/forms';
import { RibbonComponent } from './common/ribbon/ribbon.component';
import { BlogpostComponent } from './common/blogpost/blogpost.component';
import { PageComponent } from './common/page/page.component';
import { DynamicContentComponent } from './common/blogpost/dynamic-content/dynamic-content.component';
import { MissedArticleWidgetComponent } from './common/missed-article-widget/missed-article-widget.component';
import { CelebrityPageComponent } from './modules/celebrity/celebrity-page/celebrity-page.component';
import { ArtistRouteResolver, DateRouteResolver, SingleRouteResolver, SongRouteResolver } from './common/resolvers/resolver.resolver';
import { PresidentComponent } from './modules/president/president.component';
import { SafeResourceUrlPipe } from './common/pipes/safe-resource-url.pipe';
import { HistoryMainComponent } from './modules/day-in-history/history-main/history-main.component';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { ErrorHandlerService } from './services/error-handler.service';
import { HotHundredMainComponent } from './modules/hot-hundred-main/hot-hundred-main.component';
import { HotHundredSongComponent } from './modules/hot-hundred-main/hot-hundred-song/hot-hundred-song.component';
import { HotHundredArtistComponent } from './modules/hot-hundred-main/hot-hundred-artist/hot-hundred-artist.component';
import { HotHundredCardsComponent } from './modules/hot-hundred-main/hot-hundred-cards/hot-hundred-cards.component';
import { HotHundredYearComponent } from './modules/hot-hundred-main/hot-hundred-year/hot-hundred-year.component';
import { ToysComponent } from './modules/toys/toys.component';
import { OtherComponent } from './common/other/other.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { YoutubePlayerComponent } from './common/youtube.player.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BreadcrumbComponent,
    BirthdayComponent,
    DayInHistoryComponent,
    CelebrityComponent,
    InfoSidebarComponent,
    FrontFeatureComponent,
    FrontFeatureCardComponent,
    TvEffectComponentComponent,
    FooterComponent,
    PostExcerptComponent,
    MidFeatureComponent,
    PaginationComponent,
    NotFoundComponent,
    CelebCardComponent,
    RibbonComponent,
    BlogpostComponent,
    PageComponent,
    DynamicContentComponent,
    MissedArticleWidgetComponent,
    CelebrityPageComponent,
    PresidentComponent,
    SafeResourceUrlPipe,
    HistoryMainComponent,
    HotHundredMainComponent,
    HotHundredSongComponent,
    HotHundredArtistComponent,
    HotHundredCardsComponent,
    HotHundredYearComponent,
    ToysComponent,
    OtherComponent,
    YoutubePlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    LazyLoadImageModule
  ],
  providers: [ErrorHandlerService, SingleRouteResolver, DateRouteResolver, ArtistRouteResolver, SongRouteResolver, {     
     provide: DATE_PIPE_DEFAULT_OPTIONS,
     useValue: { dateFormat: "longDate" }
  }, provideClientHydration(), provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
