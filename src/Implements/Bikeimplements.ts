import { Bike } from "../Bike"

export interface BikeRepo {
    find(id: string): Promise<Bike>
    add(bike: Bike): Promise<string>
    remove(id: string): Promise<void>
    update(id: string, bike: Bike): Promise<void>
    list(): Promise<Bike[]>
}
