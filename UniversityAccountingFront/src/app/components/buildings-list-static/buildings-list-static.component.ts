import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable, map } from 'rxjs';
import { BuildingEditService } from '../../services/building-edit.service';

@Component({
  selector: 'app-buildings-list-static',
  templateUrl: './buildings-list-static.component.html',
  styleUrl: './buildings-list-static.component.css'
})
export class BuildingsListStaticComponent implements OnInit {
  public view!: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };

  public changes = {};

  constructor(
    public editService: BuildingEditService
  ) {}

  public ngOnInit(): void {
    this.view = this.editService.pipe(
      map((data) => process(data, this.gridState))
    );

    this.editService.read();
  }

  public onStateChange(state: State): void {
    this.gridState = state;

    this.editService.read();
  }
}
