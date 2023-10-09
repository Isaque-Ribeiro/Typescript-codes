import { Bike } from "../Classes/Bike"

export interface BikeRepo{
    add(bike: Bike): Promise<Bike>;
    find(bikeid: string, name: string): Promise<Bike>;
    list(): Promise<Bike[]>;
    remove(bikeid: string, name: string): Promise<void>;
}
