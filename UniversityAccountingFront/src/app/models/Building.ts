export interface Building {
    id: bigint;
    name: string;
    address: string;
    floors: number;
}

const bbbuilding: Building = <Building>{ // todo How to use what i wrote
    id: BigInt(-1),
    name: '',
    address: '',
    floors: 1
}