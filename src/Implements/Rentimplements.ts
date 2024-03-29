import { Rent } from "../Rent";

export interface RentRepo {
    add(rent: Rent): Promise<string>
    findOpen(bikeId: string, userEmail: string): Promise<Rent>
    findUserRent(email: string): Promise<boolean>
    update(id: string, rent: Rent): Promise<void>
}
