import { Component, OnInit } from '@angular/core';
import { Observable, map } from "rxjs";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  AddEvent,
  GridDataResult,
  CellClickEvent,
  CellCloseEvent,
  SaveEvent,
  CancelEvent,
  GridComponent,
  RemoveEvent,
} from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";

import { Keys } from "@progress/kendo-angular-common";
import { Room } from '../../models/Room';
import { RoomEditService } from '../../services/room-edit.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
})
export class RoomsListComponent implements OnInit {
  private room: Room = {
    name: '',
    id: BigInt(-1),
    floor: 1,
    buildingId: BigInt(-1),
    number: -1,
    roomType: 0,
    capacity: 1
  };
  public view!: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };

  public changes = {};

  constructor(
    private formBuilder: FormBuilder,
    public editService: RoomEditService
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

  public cellClickHandler(args: CellClickEvent): void {
    if (!args.isEdited) {
      args.sender.editCell(
        args.rowIndex,
        args.columnIndex,
        this.createFormGroup(args.dataItem)
      );
    }
  }

  public cellCloseHandler(args: CellCloseEvent): void {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }

      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  public addHandler(args: AddEvent): void {
    args.sender.addRow(this.createFormGroup(this.room));
  }

  public cancelHandler(args: CancelEvent): void {
    args.sender.closeRow(args.rowIndex);
  }

  public saveHandler(args: SaveEvent): void {
    if (args.formGroup.valid) {
      this.editService.create(args.formGroup.value);
      args.sender.closeRow(args.rowIndex);
    }
  }

  public removeHandler(args: RemoveEvent): void {
    this.editService.remove(args.dataItem);

    args.sender.cancelCell();
  }

  public saveChanges(grid: GridComponent): void {
    grid.closeCell();
    grid.cancelCell();

    this.editService.saveChanges();
  }

  public cancelChanges(grid: GridComponent): void {
    grid.cancelCell();

    this.editService.cancelChanges();
  }

  public createFormGroup(dataItem: Room): FormGroup {
    return this.formBuilder.group({
      id: dataItem.id,
      buildingId: dataItem.buildingId,
      name: [dataItem.name, Validators.required],
      floor: dataItem.floor,
      roomType: dataItem.roomType,
      number: dataItem.number,
      capacity: dataItem.capacity
    });
  }
}
