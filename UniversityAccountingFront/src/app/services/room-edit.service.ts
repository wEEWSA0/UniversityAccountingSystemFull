import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/Room';
import { RoomService } from './room.service';

const itemIndex = (item: Room, data: Room[]): number => {
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx].id === item.id) {
            return idx;
        }
    }

    return -1;
};

const cloneData = (data: Room[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class RoomEditService extends BehaviorSubject<Room[]> {
    private data: Room[] = [];
    private originalData: Room[] = [];
    private createdItems: Room[] = [];
    private updatedItems: Room[] = [];
    private deletedItems: Room[] = [];

    constructor(private roomService: RoomService) {
        super([]);
    }

    public read(): void {
        if (this.data.length) {
            return super.next(this.data);
        }
        
        console.log('Read');

        this.roomService.getAll().subscribe(data => {
            this.data = data;
            this.originalData = cloneData(data);
            super.next(data);
        });
    }

    public create(item: Room): void {
        this.createdItems.push(item);
        this.data.unshift(item);

        super.next(this.data);
    }

    public update(item: Room): void {
        if (!this.isNew(item)) {
            const index = itemIndex(item, this.updatedItems);
            if (index !== -1) {
                this.updatedItems.splice(index, 1, item);
            } else {
                this.updatedItems.push(item);
            }
        } else {
            const index = this.createdItems.indexOf(item);
            this.createdItems.splice(index, 1, item);
        }
    }

    public remove(item: Room): void {
        let index = itemIndex(item, this.data);
        this.data.splice(index, 1);

        index = itemIndex(item, this.createdItems);
        if (index >= 0) {
            this.createdItems.splice(index, 1);
        } else {
            this.deletedItems.push(item);
        }

        index = itemIndex(item, this.updatedItems);
        if (index >= 0) {
            this.updatedItems.splice(index, 1);
        }

        super.next(this.data);
    }

    public isNew(item: Room): boolean {
        return !item.id;
    }

    public hasChanges(): boolean {
        return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
    }

    public saveChanges(): void {
        if (!this.hasChanges()) {
            return;
        }

        console.log(this.deletedItems, this.updatedItems, this.createdItems);
        if (this.deletedItems.length) {
            this.roomService.delete(this.deletedItems.map(i => i.id)).subscribe({
                next: data => {
                  console.log('next: ');
                  console.log(data);
                },
                error: error => {
                  console.error(error);
                }
              });
        }

        if (this.updatedItems.length) {
            this.roomService.update(this.updatedItems).subscribe({
                next: data => {
                  console.log('next: ');
                  console.log(data);
                },
                error: error => {
                  console.error(error);
                }
              });
        }

        if (this.createdItems.length) {
            let dto : any[] = [];
            this.createdItems.forEach(item => {
                dto.push({
                    name: item.name,
                    floor: item.floor,
                    number: item.number,
                    roomType: item.roomType,
                    capacity: item.capacity,
                    buildingId: item.buildingId
                })
            });

            this.roomService.create(dto).subscribe({
                next: data => {
                  console.log('next: ');
                  console.log(data);
                },
                error: error => {
                  console.error(error);
                }
              });
        }

        this.reset();
    }

    public cancelChanges(): void {
        this.reset();

        this.data = this.originalData;
        this.originalData = cloneData(this.originalData);
        super.next(this.data);
    }

    public assignValues(target: Room, source: Room): void {
        Object.assign(target, source);
    }

    private reset() {
        this.data = [];
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = [];
    }
}