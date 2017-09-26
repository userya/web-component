import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DivComponent } from './div.component';
import { LayoutComponent } from './layout.component';
import { ComponentDirective } from './component.directive';
import { DynamicComponent } from './dynamic.component';
import { IdeSelectedComponent } from './ide-selected.component';
import { IdeHoverComponent } from './ide-hover.component';
import { IdeDragComponent } from './ide-drag.component';
import { IdePreAddComponent } from './ide-pre-add.component';

import { RowComponent } from './foundation/row.component';
import { ColComponent } from './foundation/col.component';
import { TextComponent } from './foundation/text.component';

@NgModule({
  declarations: [
    AppComponent,
    DivComponent,
    LayoutComponent,
    ComponentDirective,
    DynamicComponent,
    RowComponent,
    ColComponent,
    TextComponent,
    IdeSelectedComponent,
    IdeHoverComponent,
    IdeDragComponent,
    IdePreAddComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [AppService, { provide: 'windowRef', useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
