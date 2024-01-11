import { NgModule, Type } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { BuildingsListComponent } from './pages/buildings-list/buildings-list.component';
import { RoomsListComponent } from './pages/rooms-list/rooms-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'buildings', pathMatch: 'full' },
  { path: 'buildings', pathMatch: 'prefix', component: BuildingsListComponent, data: { text: 'Building' } },
  { path: 'rooms', pathMatch: 'prefix', component: RoomsListComponent, data: { text: 'Room' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
