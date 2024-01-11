import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Building } from '../models/Building';
import { BuildingService } from './building.service';

const itemIndex = (item: Building, data: Building[]): number => {
    for (let idx = 0; idx < data.length; idx++) {
        if (data[idx].id === item.id) {
            return idx;
        }
    }

    return -1;
};

const cloneData = (data: Building[]) => data.map(item => Object.assign({}, item));

@Injectable()
export class BuildingEditService extends BehaviorSubject<Building[]> {
    private data: Building[] = [];
    private originalData: Building[] = [];
    private createdItems: Building[] = [];
    private updatedItems: Building[] = [];
    private deletedItems: Building[] = [];

    constructor(private buildingService: BuildingService) {
        super([]);
    }

    public read(): void {
        if (this.data.length) {
            return super.next(this.data);
        }
        
        console.log('Read');

        this.buildingService.getAll().subscribe(data => {
            this.data = data;
            this.originalData = cloneData(data);
            super.next(data);
        });
    }

    public create(item: Building): void {
        this.createdItems.push(item);
        this.data.unshift(item);

        super.next(this.data);
    }

    public update(item: Building): void {
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

    public remove(item: Building): void {
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

    public isNew(item: Building): boolean {
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
            this.buildingService.delete(this.deletedItems.map(i => i.id)).subscribe({
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
            this.buildingService.update(this.updatedItems).subscribe({
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
                    floors: item.floors,
                    address: item.address
                })
            });

            this.buildingService.create(dto).subscribe({
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

    public assignValues(target: Building, source: Building): void {
        Object.assign(target, source);
    }

    private reset() {
        this.data = [];
        this.deletedItems = [];
        this.updatedItems = [];
        this.createdItems = [];
    }
}