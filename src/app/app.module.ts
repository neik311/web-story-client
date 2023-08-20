import { registerLocaleData } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import vi from '@angular/common/locales/vi'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTabsModule } from '@angular/material/tabs'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzListModule } from 'ng-zorro-antd/list'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzProgressModule } from 'ng-zorro-antd/progress'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { CardModule } from 'primeng/card'
import { CarouselModule } from 'primeng/carousel'
import { TagModule } from 'primeng/tag'
import { ButtonModule } from 'primeng/button'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTableModule } from 'ng-zorro-antd/table'
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireStorageModule } from '@angular/fire/compat/storage'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzCommentModule } from 'ng-zorro-antd/comment'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzPopoverModule } from 'ng-zorro-antd/popover'

import { OverlayContainer } from '@angular/cdk/overlay'
import { BasicAuthInterceptor } from './_helpers/basic-auth.interceptor'
import { ErrorInterceptor } from './_helpers/error.interceptor'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { InAppRootOverlayContainer } from './in-app-root-overlay-container'
import { ApiService, AuthenticationService, CoreService, NotifyService } from './services'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { HomeComponent } from './pages/home/home.component'
import { LoginComponent } from './pages/login/login.component'
import { environment } from '../environments/environment'
import { StoryComponent } from './pages/story/story.component'
import { ReadComponent } from './pages/read/read.component'
import { FavoriteComponent } from './pages/favorite/favorite.component'
import { HistoryComponent } from './pages/history/history.component'
import { RegisterComponent } from './pages/register/register.component'
import { FirebaseUpload } from './_helpers/firebaseUpload'
import { SearchStoryComponent } from './pages/searchStory/searchStory.component'
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'

const antDesignIcons = AllIcons as { [key: string]: IconDefinition }
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key: string) => antDesignIcons[key])

registerLocaleData(vi)

@NgModule({
  exports: [MatDialogModule, MatTabsModule, MatSnackBarModule],
  declarations: [],
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    StoryComponent,
    ReadComponent,
    FavoriteComponent,
    HistoryComponent,
    RegisterComponent,
    SearchStoryComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzCardModule,
    NzDividerModule,
    NzInputModule,
    NzListModule,
    NzTagModule,
    NzAvatarModule,
    NzGridModule,
    NzButtonModule,
    NzProgressModule,
    NzDatePickerModule,
    NzIconModule.forRoot(icons),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    CardModule,
    CarouselModule,
    TagModule,
    ButtonModule,
    NzPaginationModule,
    NzTabsModule,
    NzTableModule,
    NzSelectModule,
    NzCommentModule,
    NzModalModule,
    NzPopoverModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: OverlayContainer, useClass: InAppRootOverlayContainer },
    NotifyService,
    ApiService,
    AuthenticationService,
    CoreService,
    FirebaseUpload,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
