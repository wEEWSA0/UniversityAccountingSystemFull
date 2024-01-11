import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildingsListComponent } from './pages/buildings-list/buildings-list.component';
import { FormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TypographyModule } from '@progress/kendo-angular-typography';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ListViewModule } from '@progress/kendo-angular-listview';
import { GridModule } from '@progress/kendo-angular-grid';
import { NavigationModule } from "@progress/kendo-angular-navigation";

import { BuildingEditService } from './services/building-edit.service';
import { RoomEditService } from './services/room-edit.service';
import { RoomsListComponent } from './pages/rooms-list/rooms-list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BuildingsListStaticComponent } from './components/buildings-list-static/buildings-list-static.component';

@NgModule({
  declarations: [
    AppComponent,
    BuildingsListComponent,
    RoomsListComponent,
    NavigationComponent,
    BuildingsListStaticComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,

    // Kendo UI
    InputsModule,
    LabelModule,
    ButtonModule,
    TypographyModule,
    NotificationModule,
    ListViewModule,
    GridModule,
    NavigationModule
  ],
  providers: [
    BuildingEditService,
    RoomEditService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
