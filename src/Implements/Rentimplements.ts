import { Rent } from "../Classes/Rent"

export interface RentRepo{
    add(rent: Rent): Promise<Rent>;
    find(bikeid: string, usersemail: string, userpw: string): Promise<Rent>;
    list(): Promise<Rent[]>;
    remove(bikeid: string, usersemail: string, userpw: string): Promise<void>;
}
