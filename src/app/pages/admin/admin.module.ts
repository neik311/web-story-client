import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NzBadgeModule } from 'ng-zorro-antd/badge'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCascaderModule } from 'ng-zorro-antd/cascader'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzCollapseModule } from 'ng-zorro-antd/collapse'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzImageModule } from 'ng-zorro-antd/image'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzUploadModule } from 'ng-zorro-antd/upload'
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule } from 'ng2-currency-mask'
import { NgxPrintModule } from 'ngx-print'
import { MaterialModule } from '../../app.module'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzCardModule } from 'ng-zorro-antd/card'
import {
  RichTextEditorModule,
  ToolbarService,
  TableService,
  QuickToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  MarkdownEditorService,
} from '@syncfusion/ej2-angular-richtexteditor'
import { NzAvatarModule } from 'ng-zorro-antd/avatar'

import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { AdminRoutingModule } from './admin-routing.module'
import { CategoryComponent } from './category/category.component'
import { AddOrEditCategoryComponent } from './category/add-or-edit-category/add-or-edit-category.component'
import { StoryComponent } from './story/story.component'
import { AddOrEditStoryComponent } from './story/add-or-edit-story/add-or-edit-story.component'
import { ChapterComponent } from './chapter/chapter.component'
import { AddOrEditChapterComponent } from './chapter/add-or-edit-chapter/add-or-edit-chapter.component'
import { CommentComponent } from './comment/comment.component'
import { UserComponent } from './user/user.component'
import { ChapterDetailComponent } from './chapter/chapter-detail/chapter-detail.component'
import { StoryDetailComponent } from './story/story-detail/story-detail.component'
import { StoryPrintComponent } from './story/story-print/story-print.component'
import { DirectivesModule } from '../../directives/directives.module'

@NgModule({
  declarations: [
    CategoryComponent,
    AddOrEditCategoryComponent,
    StoryComponent,
    AddOrEditStoryComponent,
    ChapterComponent,
    AddOrEditChapterComponent,
    CommentComponent,
    UserComponent,
    ChapterDetailComponent,
    StoryDetailComponent,
    StoryPrintComponent,
  ],
  imports: [
    DirectivesModule,
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    NzModalModule,
    NzIconModule,
    NzToolTipModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzCheckboxModule,
    NzTabsModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzPopconfirmModule,
    NzPaginationModule,
    MaterialModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    NzInputNumberModule,
    NzUploadModule,
    NzRadioModule,
    NzCascaderModule,
    NzTagModule,
    NzBadgeModule,
    NzImageModule,
    NgxPrintModule,
    NzCollapseModule,
    NzSwitchModule,
    NzDropDownModule,
    NzCardModule,
    RichTextEditorModule,
    NzAvatarModule,
  ],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService, MarkdownEditorService],
  // providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
