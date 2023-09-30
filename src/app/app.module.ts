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
import { PostExcerptComponent } from './components/post-excerpt/post-excerpt.component';
import { MidFeatureComponent } from './components/mid-feature/mid-feature.component';
import { PostExcerptContainerComponent } from './components/post-excerpt-container/post-excerpt-container.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { CelebCardComponent } from './modules/celebrity/celeb-card/celeb-card.component';
import { FormsModule } from '@angular/forms';
import { RibbonComponent } from './common/ribbon/ribbon.component';
import { BlogpostComponent } from './common/blogpost/blogpost.component';
import { PageComponent } from './common/page/page.component';
import { DynamicContentComponent } from './common/blogpost/dynamic-content/dynamic-content.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: PageComponent },
  { path: 'page/:pageId', component: PageComponent },
  { path: 'page/:pageId/:postTitle', component: BlogpostComponent },
  { path: 'post/:postTitle', component: BlogpostComponent },
  { path: 'birthday', component: BirthdayComponent },
  { path: 'day-in-history', component: DayInHistoryComponent },
  { path: 'celebrity', component: CelebrityComponent },
  { path: '**', component: NotFoundComponent }
];

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
    FooterComponent,
    PostExcerptComponent,
    MidFeatureComponent,
    PostExcerptContainerComponent,
    PaginationComponent,
    NotFoundComponent,
    CelebCardComponent,
    RibbonComponent,
    BlogpostComponent,
    PageComponent,
    DynamicContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
