export interface Room {
    id: bigint;
    buildingId: bigint;
    name: string;
    roomType: number;
    capacity: number;
    floor: number; // todo make Short
    number: number;
}